/* ============================================================
   RadiEndo · TUTORA VIRTUAL (recuperação semântica de trechos)
   A tutora NÃO gera respostas novas: localiza, na base de
   conhecimento da pesquisadora, os trechos mais relevantes para a
   pergunta e mostra cada um com sua referência.
   Uso: RadiTutor.mount(elemento, { log, prefill, verReferencias })
   ============================================================ */
(function () {
  const LIB = window.RADIENDO_BIBLIOTECA, CFG = window.RADIENDO_CONFIG || {};
  const B = window.RadiBusca;
  B.init(LIB, CFG.busca);

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    });
    kids.flat(Infinity).forEach(k => { if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k)); });
    return e;
  }
  const refDe = id => (LIB.referencias || []).find(r => r.id === id);
  const eixoDe = id => (LIB.eixos || []).find(e => e.id === id);
  const EXEMPLOS = [
    "O que é a lâmina dura e como ela aparece na radiografia?",
    "Como diferenciar granuloma de cisto radicular?",
    "Quando indicar a tomografia (TCFC) em Endodontia?",
    "O forame mentual pode ser confundido com lesão periapical?",
    "Como a radiografia mostra uma reabsorção interna?",
    "A inteligência artificial detecta lesões periapicais?"
  ];

  function textoComLista(texto) {
    const wrap = h("div", { class: "tt-text" });
    let ul = null;
    texto.split("\n").forEach(l => {
      const m = l.match(/^(\s*)•\s+(.*)$/);
      if (m) { if (!ul) { ul = h("ul"); wrap.append(ul); } ul.append(h("li", { style: m[1] ? "margin-left:16px" : "" }, m[2])); }
      else { ul = null; wrap.append(h("p", {}, l)); }
    });
    return wrap;
  }

  function cartao(r, i, opt) {
    const t = r.t, e = eixoDe(t.eixo);
    return h("article", { class: "tt-card" },
      h("div", { class: "tt-head" },
        h("span", { class: "tt-n" }, String(i + 1)),
        h("div", { class: "tt-title" }, h("strong", {}, t.titulo), h("small", {}, "Eixo " + t.eixo + (e ? " · " + e.titulo : "") + " · " + t.secao)),
        h("span", { class: "tt-rel " + (r.nivel === "Alta" ? "alta" : "media"), title: "Proximidade do trecho com a sua pergunta" }, "Relevância " + r.nivel.toLowerCase())),
      textoComLista(t.texto),
      h("div", { class: "tt-src" }, h("b", {}, "Fonte: "),
        (t.refs || []).map(id => { const rf = refDe(id); return h("div", { class: "tt-ref" }, rf ? rf.citacao : id); }),
        h("div", { class: "small muted" }, "Trecho do resumo elaborado pela pesquisadora com base na(s) referência(s) acima. ",
          h("a", { href: "#referencias", onclick: opt.verReferencias ? (ev => { ev.preventDefault(); opt.verReferencias(); }) : null }, "Ver lista de referências"))));
  }

  function mount(root, opt) {
    opt = opt || {};
    const status = h("div", { class: "tt-status" });
    const input = h("input", { id: "ttInput", placeholder: "Digite sua pergunta em linguagem natural…", autocomplete: "off", maxlength: "300", "aria-label": "Pergunta para a tutora" });
    const btn = h("button", { class: "btn", type: "submit" }, "Buscar");
    const out = h("div", { class: "tt-out", "aria-live": "polite" });
    const form = h("form", { class: "tt-form" }, input, btn);
    if (opt.prefill) input.value = opt.prefill;

    function pintaStatus() {
      const s = B.estado();
      let txt, cls = "";
      if (s.semantica === "pronta") { txt = "Busca semântica ativa (por significado)."; cls = "ok"; }
      else if (s.semantica === "carregando") { txt = s.msg || "Carregando o modelo de busca…"; cls = "load"; }
      else if (s.semantica === "falhou") { txt = "Busca por palavras ativa (o modelo semântico não pôde ser carregado neste computador)."; cls = "warn"; }
      else if (s.semantica === "desligada") { txt = "Busca por palavras ativa."; cls = "warn"; }
      else txt = "Preparando a busca…";
      status.className = "tt-status " + cls; status.textContent = txt;
    }
    pintaStatus();
    B.prepararSemantica(() => pintaStatus()).then(pintaStatus);

    async function buscar(q) {
      q = (q || "").trim(); if (!q) return;
      btn.disabled = true; out.replaceChildren(h("div", { class: "muted" }, "Buscando…"));
      let r;
      try { r = await B.buscar(q); } catch (e) { r = { resultados: [], semResultado: true, melhor: 0, modo: "erro" }; }
      pintaStatus();
      if (opt.log) opt.log("tutor_question", { text: q });
      if (opt.log) opt.log("tutor_result", { ids: r.resultados.map(x => x.t.id), melhor: +(+r.melhor).toFixed(3), modo: r.modo, sem_resultado: !!r.semResultado });
      if (r.semResultado) {
        out.replaceChildren(h("div", { class: "tt-none" },
          h("strong", {}, "Não localizei conteúdo adequado na base de conhecimento para essa pergunta."),
          h("p", {}, "A tutora só apresenta trechos que existem nos materiais cadastrados pela pesquisadora, por isso não responde fora deles. Você pode reformular a pergunta usando termos da radiologia endodôntica (por exemplo, “lâmina dura”, “rarefação óssea periapical”, “TCFC”) ou consultar as referências."),
          h("button", { class: "btn ghost", type: "button", onclick: () => opt.verReferencias && opt.verReferencias() }, "Ver referências")));
        return;
      }
      out.replaceChildren(
        h("div", { class: "small muted", style: "margin:4px 0 10px" }, r.resultados.length + (r.resultados.length > 1 ? " trechos encontrados" : " trecho encontrado") + ", em ordem de relevância. Confira sempre a fonte."),
        ...r.resultados.map((x, i) => cartao(x, i, opt)));
    }
    form.addEventListener("submit", async e => { e.preventDefault(); await buscar(input.value); btn.disabled = false; });

    root.replaceChildren(
      h("div", { class: "eyebrow" }, "Apoio ao raciocínio"), h("h1", {}, "Tutora virtual"),
      h("p", { class: "muted" }, "Pergunte com suas palavras. A tutora procura, na base de conhecimento do RadiEndo, os trechos mais próximos da sua dúvida e mostra a fonte de cada um."),
      h("div", { class: "card tt-box" }, form, status,
        h("div", { class: "tt-chips" }, h("span", { class: "small muted" }, "Exemplos: "), EXEMPLOS.map(x => h("button", { type: "button", class: "chip", onclick: () => { input.value = x; input.focus(); } }, x))),
        out),
      h("div", { class: "notice", style: "margin-top:14px" }, "A tutora não gera respostas nem substitui o professor ou o julgamento clínico: ela apenas recupera trechos dos resumos elaborados pela pesquisadora. Não insira dados pessoais ou de pacientes. As perguntas podem ser registradas para fins da pesquisa."));
  }

  window.RadiTutor = { mount, exemplos: EXEMPLOS };
})();
