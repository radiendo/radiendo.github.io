/* ============================================================
   RadiEndo · MOTOR DE BUSCA (recuperação de trechos)
   Não gera respostas: apenas localiza, na base de conhecimento
   (js/biblioteca.js), os trechos mais próximos da pergunta.
   - Busca semântica: modelo gratuito de embeddings executado no
     navegador (Transformers.js + multilingual-e5-small).
   - Busca por palavras (reserva): funciona sem internet e é usada
     sozinha se o modelo não puder ser carregado.
   Os vetores dos trechos ficam guardados no navegador (IndexedDB).
   ============================================================ */
(function () {
  const DEF = {
    usarSemantica: true,
    modelo: "Xenova/multilingual-e5-small",
    transformersUrl: "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1",
    // Limiares (calibrar no teste com perguntas; ver admin.html > Testar busca)
    semMin: 0.80, semAlta: 0.86,
    lexMin: 0.40, lexAlta: 0.80,
    maxResultados: 5
  };
  let cfg = Object.assign({}, DEF), lib = null, docs = [], N = 0;
  let idf = {}, avgdl = 1, vocab = new Set();
  let est = { modo: "lexico", semantica: "inativa", msg: "", progresso: 0 };
  let extractor = null, vetores = null, preparando = null;

  /* ---------- texto ---------- */
  const STOP = new Set(("a o as os um uma uns umas de da do das dos em no na nos nas por para com sem sobre entre e ou que qual quais quem como quando onde porque se ao aos à às pelo pela pelos pelas " +
    "ser sao é era foi eh esta estao ha tem ter ter-se isso isto esse essa esses essas este esta estes estas aquele aquela mais menos muito muita pouco ja nao tambem so seu sua seus suas meu minha me eu voce " +
    "pode podem posso consegue conseguem fazer faz diferenca explique explica fale falar diga dizer defina definir significa significado conceito exemplo exemplos").split(/\s+/));
  const sem_acento = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function stem(w) {
    if (w.length > 5) w = w.replace(/(mente)$/, "");
    if (w.length > 4) w = w.replace(/(coes|cao)$/, "c");
    if (w.length > 4) w = w.replace(/(ais|eis|ois)$/, "al");
    if (w.length > 4) w = w.replace(/(es)$/, "");
    if (w.length > 3) w = w.replace(/s$/, "");
    if (w.length > 5) w = w.replace(/(ar|er|ir)$/, "");
    if (w.length > 5) w = w.replace(/(ica|ico|ia|io|a|o|e)$/, "");
    return w.slice(0, 5); // prefixo curto aproxima variações (indicar/indicação)
  }
  function tokens(s) {
    return sem_acento(s).split(/[^a-z0-9]+/).filter(t => t && !STOP.has(t) && (t.length > 1 || /\d/.test(t))).map(stem);
  }
  const textoDoc = t => [rotuloEixo(t.eixo), t.secao, t.titulo, t.texto].join(". ");
  function rotuloEixo(id) { const e = (lib.eixos || []).find(x => x.id === id); return e ? e.titulo : ""; }

  /* ---------- índice léxico (BM25) ---------- */
  function indexar() {
    docs = (lib.trechos || []).map(t => {
      const titToks = tokens(t.titulo + " " + t.secao), txt = tokens(t.texto);
      const toks = txt.concat(titToks, titToks); // título pesa mais
      const tf = {}; toks.forEach(w => tf[w] = (tf[w] || 0) + 1);
      return { t, tf, len: toks.length };
    });
    N = docs.length; vocab = new Set(); idf = {}; const df = {};
    docs.forEach(d => Object.keys(d.tf).forEach(w => { df[w] = (df[w] || 0) + 1; vocab.add(w); }));
    Object.keys(df).forEach(w => idf[w] = Math.log(1 + (N - df[w] + .5) / (df[w] + .5)));
    avgdl = docs.reduce((a, d) => a + d.len, 0) / Math.max(1, N);
  }
  // cobertura: fração do "peso" dos termos da pergunta encontrada no trecho (0 a 1)
  function lexScore(qt, d) {
    let tot = 0, hit = 0, bm = 0;
    qt.forEach(w => {
      const wi = idf[w] != null ? idf[w] : Math.log(1 + (N + .5) / .5); // termo fora da base pesa como raro
      tot += wi;
      const f = d.tf[w] || 0;
      if (f) { hit += wi; bm += wi * (f * 2.2) / (f + 1.2 * (1 - .75 + .75 * d.len / avgdl)); }
    });
    return { cobertura: tot ? hit / tot : 0, bm25: bm };
  }

  /* ---------- semântica ---------- */
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
  const chaveCache = () => cfg.modelo + "|" + hash(docs.map(d => textoDoc(d.t)).join("\u0001"));
  function idb() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) return rej(new Error("sem IndexedDB"));
      const r = indexedDB.open("radiendo-busca", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("vet");
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  async function cacheGet(k) { try { const db = await idb(); return await new Promise(res => { const q = db.transaction("vet").objectStore("vet").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } }
  async function cachePut(k, v) { try { const db = await idb(); await new Promise(res => { const tx = db.transaction("vet", "readwrite"); tx.objectStore("vet").clear(); tx.objectStore("vet").put(v, k); tx.oncomplete = res; tx.onerror = res; }); } catch (e) { } }

  async function embed(textos, prefixo) {
    const out = await extractor(textos.map(t => prefixo + t), { pooling: "mean", normalize: true });
    return out.tolist().map(v => Float32Array.from(v));
  }
  function dot(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }

  async function prepararSemantica(onProgress) {
    if (!cfg.usarSemantica) { est.semantica = "desligada"; return est; }
    if (vetores) return est;
    if (preparando) return preparando;
    const say = (msg, p) => { est.msg = msg; if (p != null) est.progresso = p; if (onProgress) try { onProgress(Object.assign({}, est)); } catch (e) { } };
    preparando = (async () => {
      try {
        est.semantica = "carregando"; say("Carregando o modelo de busca…", 0);
        const mod = await import(/* @vite-ignore */ cfg.transformersUrl);
        const files = {};
        extractor = await mod.pipeline("feature-extraction", cfg.modelo, {
          dtype: "q8",
          progress_callback: p => {
            if (p.status === "progress" && p.file) {
              files[p.file] = p.progress || 0;
              const v = Object.values(files); const m = v.reduce((a, b) => a + b, 0) / v.length;
              say("Baixando o modelo (somente na primeira vez)… " + Math.round(m) + "%", m * .8);
            }
          }
        });
        const k = chaveCache(); let vs = await cacheGet(k);
        if (!vs || vs.length !== docs.length) {
          vs = []; const B = 8;
          for (let i = 0; i < docs.length; i += B) {
            const lote = docs.slice(i, i + B).map(d => textoDoc(d.t));
            vs.push(...await embed(lote, "passage: "));
            say("Indexando os conteúdos… " + Math.min(i + B, docs.length) + "/" + docs.length, 80 + 20 * (i + B) / docs.length);
          }
          await cachePut(k, vs);
        }
        vetores = vs; est.semantica = "pronta"; est.modo = "semantico"; say("Busca semântica pronta.", 100);
      } catch (e) {
        console.warn("[RadiBusca] semântica indisponível:", e);
        est.semantica = "falhou"; est.modo = "lexico"; est.erro = String(e && e.message || e);
        say("Busca semântica indisponível neste computador; usando busca por palavras.", 0);
      } finally { preparando = null; }
      return est;
    })();
    return preparando;
  }

  /* ---------- busca ---------- */
  async function buscar(pergunta, opt) {
    const k = (opt && opt.k) || cfg.maxResultados;
    const q = String(pergunta || "").trim();
    if (!q || !docs.length) return { modo: est.modo, resultados: [], semResultado: true, melhor: 0 };
    const qt = tokens(q);
    let lex = docs.map(d => Object.assign({ d }, lexScore(qt, d)));
    let sims = null, modo = "lexico";
    if (vetores && extractor) {
      try { const qv = (await embed([q], "query: "))[0]; sims = vetores.map(v => dot(qv, v)); modo = "semantico"; } catch (e) { sims = null; }
    }
    let lista = lex.map((l, i) => {
      const lexOk = l.cobertura >= cfg.lexMin;
      if (sims) {
        const s = sims[i];
        const ok = s >= cfg.semMin || (l.cobertura >= cfg.lexAlta && s >= cfg.semMin - 0.04);
        const nivel = s >= cfg.semAlta || (l.cobertura >= cfg.lexAlta && s >= cfg.semMin) ? "Alta" : "Média";
        return { t: l.d.t, sem: s, lex: l.cobertura, ok, nivel, rank: s + 0.08 * l.cobertura + 0.0005 * l.bm25 };
      }
      return { t: l.d.t, sem: null, lex: l.cobertura, ok: lexOk, nivel: l.cobertura >= cfg.lexAlta ? "Alta" : "Média", rank: l.cobertura + 0.01 * l.bm25 };
    });
    lista.sort((a, b) => b.rank - a.rank);
    const todos = lista.slice(0, k);
    const resultados = lista.filter(x => x.ok).slice(0, k);
    return { modo, resultados, candidatos: todos, semResultado: !resultados.length, melhor: lista[0] ? (sims ? lista[0].sem : lista[0].lex) : 0 };
  }

  window.RadiBusca = {
    DEFAULTS: DEF,
    init(biblioteca, config) { lib = biblioteca; cfg = Object.assign({}, DEF, config || {}); vetores = null; indexar(); est.modo = vetores ? "semantico" : "lexico"; return this; },
    reindexar(biblioteca) { lib = biblioteca; vetores = null; indexar(); est.modo = "lexico"; if (est.semantica === "pronta") est.semantica = "inativa"; },
    setLimiares(o) { Object.assign(cfg, o); },
    limiares() { return { semMin: cfg.semMin, semAlta: cfg.semAlta, lexMin: cfg.lexMin, lexAlta: cfg.lexAlta }; },
    prepararSemantica, buscar,
    estado() { return Object.assign({}, est); },
    tamanho() { return N; },
    _tokens: tokens
  };
})();
