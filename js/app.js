/* ============================================================
   RadiEndo · APLICAÇÃO (navegação, trilha e telas)
   Etapa 1 Normalidade -> Etapa 2 Alterações -> Etapa 3 Diagnóstico.
   Lê o conteúdo de content.js e diagnostico.js e registra eventos
   via data.js. O pré/pós-teste da pesquisa NÃO faz parte do site.
   ============================================================ */
(function () {
  const C = window.RADIENDO_CONTENT, DG = window.RADIENDO_DIAG;
  const D = window.RadiData, T = window.RadiTutor, CFG = window.RADIENDO_CONFIG;
  const DEV = !!CFG.modoDesenvolvimento;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    });
    kids.flat(Infinity).forEach(k => { if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k)); });
    return e;
  }
  const put = (root, ...kids) => root.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));
  const NS = "http://www.w3.org/2000/svg";
  const pad = n => String(n).padStart(2, "0");
  const devBadge = (t) => DEV ? h("span", { class: "badge-demo" }, t) : null;

  const PAGES = {
    home: "Início", etapa1: "Etapa 1 / Normalidade", etapa2: "Etapa 2 / Alterações",
    etapa3: "Etapa 3 / Diagnóstico endodôntico", tutor: "Apoio / Tutora virtual", pesquisador: "Pesquisador / Registros"
  };

  /* ================= PROGRESSO DA TRILHA ================= */
  const mem = {};
  const pkey = () => "radiendo.prog." + (D.isParticipant() ? D.getSession().code : "visitante");
  function pload() {
    const k = pkey(); if (mem[k]) return mem[k];
    let v = {}; try { v = JSON.parse(localStorage.getItem(k)) || {}; } catch (e) {}
    return (mem[k] = v);
  }
  function psave() { try { localStorage.setItem(pkey(), JSON.stringify(mem[pkey()])); } catch (e) {} }
  const seen = n => pload()["e" + n] || [];
  function mark(n, id) { const p = pload(); p["e" + n] = p["e" + n] || []; if (p["e" + n].includes(id)) return false; p["e" + n].push(id); psave(); return true; }
  const total = n => C.lab.filter(l => l.stage === n).reduce((a, l) => a + l.regions.length, 0);
  const isDone = n => seen(n).length >= total(n);
  function unlocked(n) { if (!CFG.trilhaLinear || n === 1) return true; return isDone(n - 1); }
  function nextStage() { for (let n = 1; n <= 3; n++) if (n === 3 ? unlocked(3) : (!isDone(n))) return n; return 3; }

  /* ================= NAVEGAÇÃO ================= */
  function route() { const id = (location.hash || "#home").slice(1); showPage(PAGES[id] ? id : "home"); }
  function go(id) { if ((location.hash || "#home").slice(1) === id) showPage(id); else location.hash = id; }
  function showPage(id) {
    $$(".page").forEach(p => p.classList.toggle("active", p.id === id));
    $$("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === id));
    $("#crumb").textContent = PAGES[id]; $("#sidebar").classList.remove("open"); window.scrollTo({ top: 0 });
    if (/^etapa\d$/.test(id)) renderStage(+id.slice(5));
    if (id === "home") renderHome();
    if (id === "pesquisador") renderResearcher();
    D.log("page_view", { page: id }, id);
  }
  function refreshNav() {
    [1, 2, 3].forEach(n => {
      const b = $(`#nav button[data-page="etapa${n}"]`); const lock = !unlocked(n);
      b.classList.toggle("locked", lock); b.classList.toggle("done", n < 3 && isDone(n));
      $(".st", b).textContent = lock ? "🔒" : (n < 3 && isDone(n) ? "✓" : "");
    });
  }

  /* ================= INÍCIO ================= */
  function renderHome() {
    const cur = nextStage();
    put($("#home"),
      h("div", { class: "hero" },
        h("div", { class: "eyebrow", style: "color:#76e4ef" }, "Aprendizagem · Imagem · Raciocínio clínico"),
        h("h1", { html: "Do dente normal<br>ao diagnóstico endodôntico." }),
        h("p", {}, "Aprenda as estruturas normais, reconheça as alterações radiográficas e use o fluxograma clínico para chegar a um diagnóstico."),
        h("button", { class: "btn", onclick: () => go("etapa" + cur) }, (seen(1).length || seen(2).length ? "Continuar" : "Começar") + "  →")),
      h("div", { class: "section-head" }, h("div", {}, h("div", { class: "eyebrow" }, "Trilha de aprendizagem"), h("h2", {}, "Três etapas em sequência"),
        h("p", {}, CFG.trilhaLinear ? "Cada etapa é liberada ao concluir a anterior." : "Você pode navegar livremente entre as etapas."))),
      h("div", { class: "stage-grid" }, [1, 2, 3].map(n => {
        const S = C.stages[n], lock = !unlocked(n);
        const state = lock ? "🔒 Conclua a etapa anterior" : (n < 3 ? (isDone(n) ? "✓ Concluída" : seen(n).length + " de " + total(n) + " regiões exploradas") : "Disponível");
        return h("article", { class: "card stage-card" + (lock ? " locked" : "") },
          h("div", { class: "num" }, S.short.toUpperCase()), h("h3", {}, S.title), h("p", {}, S.goal),
          n < 3 ? h("div", { class: "bar" }, h("i", { style: "width:" + Math.round(100 * seen(n).length / total(n)) + "%" })) : null,
          h("div", { class: "state" }, state),
          h("button", { class: "btn " + (n === cur ? "" : "ghost"), style: "margin-top:12px", disabled: lock, onclick: () => go("etapa" + n) }, lock ? "Bloqueada" : "Abrir"));
      })),
      h("p", { class: "footer-note" }, "RadiEndo é um ambiente educacional em desenvolvimento. Não utilizar para diagnóstico ou atendimento de pacientes."));
  }

  /* ================= ETAPAS 1 E 2 ================= */
  const ls = { 1: { item: 0, region: null }, 2: { item: 0, region: null } };

  function renderStage(n) {
    if (n === 3) return renderStage3();
    const root = $("#etapa" + n), S = C.stages[n];
    if (!unlocked(n)) return put(root, lockBox(n));
    const items = C.lab.filter(l => l.stage === n);
    const st = ls[n]; const it = items[st.item];
    const stage = h("div", { class: "stage", style: "aspect-ratio:" + it.viewBox.split(" ").slice(2).join("/") });
    stage.append(h("img", { src: it.src, alt: it.title, draggable: "false" }));
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", it.viewBox); svg.setAttribute("class", "ov"); svg.setAttribute("aria-label", "Regiões clicáveis");
    it.regions.forEach(r => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", r.path); p.setAttribute("class", "hotspot" + (st.region === r.id ? " selected" : ""));
      p.setAttribute("tabindex", "0"); p.setAttribute("role", "button"); p.setAttribute("aria-label", r.label);
      p.addEventListener("click", () => pick(n, r.id));
      p.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(n, r.id); } });
      svg.append(p);
    });
    stage.append(svg);

    const reg = it.regions.find(r => r.id === st.region);
    const nSeen = seen(n).length, nTot = total(n), done = isDone(n);
    put(root,
      h("div", { class: "eyebrow" }, S.short + " · " + S.title), h("h1", {}, S.title),
      h("p", { class: "muted" }, S.goal + " " + S.how),
      h("div", { class: "bar" }, h("i", { style: "width:" + Math.round(100 * nSeen / nTot) + "%" })),
      h("div", { class: "small muted", style: "margin-bottom:14px" }, nSeen + " de " + nTot + " regiões exploradas"),
      done ? h("div", { class: "banner" }, h("span", {}, n < 3 ? "✓ Etapa concluída! A próxima etapa está liberada." : ""), h("button", { class: "btn", onclick: () => go("etapa" + (n + 1)) }, "Ir para a Etapa " + (n + 1) + "  →")) : null,
      it.real ? null : h("div", { class: "notice", style: "margin:12px 0" }, "Ilustração esquemática criada para fins didáticos. Não é uma radiografia clínica real nem representa um caso de paciente."),
      items.length > 1 ? h("div", { class: "pill-row" }, items.map((x, i) =>
        h("button", { class: i === st.item ? "active" : "", onclick: () => { ls[n] = { item: i, region: null }; D.log("lab_image", { stage: n, image: x.id }); renderStage(n); } }, x.title))) : null,
      h("div", { class: "lab-layout" },
        h("div", { class: "card" }, h("div", { class: "xray" }, stage), h("div", { class: "xray-caption" }, it.caption)),
        h("div", { class: "card" }, h("h3", {}, "Regiões", devBadge(it.status === "demo" ? "proposta" : "")),
          h("div", { class: "structure-list" }, it.regions.map((r, i) => {
            const ok = seen(n).includes(it.id + ":" + r.id);
            return h("button", { class: (st.region === r.id ? "active " : "") + (ok ? "seen" : ""), onclick: () => pick(n, r.id) }, pad(i + 1) + " · " + r.label, ok ? h("span", { class: "ck" }, "✓") : null);
          })),
          h("div", { class: "info-panel" }, reg ? [h("h4", {}, reg.label), h("p", {}, reg.text)] : [h("h4", {}, "Explore a imagem"), h("p", {}, "Clique em uma região da imagem ou da lista para ler a descrição.")]),
          it.diagnoses ? h("div", {}, h("div", { class: "small muted", style: "margin-top:12px" }, "Achado presente em diagnósticos como:"), h("div", { class: "chips" }, it.diagnoses.map(d => h("span", { class: "chip" }, DG.dx[d].nome)))) : null)),
      quizBlock(n));
  }
  function pick(n, regionId) {
    const items = C.lab.filter(l => l.stage === n), it = items[ls[n].item];
    ls[n].region = regionId;
    const wasDone = isDone(n);
    mark(n, it.id + ":" + regionId);
    D.log("lab_region", { stage: n, image: it.id, region: regionId });
    if (!wasDone && isDone(n)) D.log("stage_complete", { stage: n });
    refreshNav(); renderStage(n);
  }
  function lockBox(n) {
    return h("div", { class: "card lockbox" }, h("div", { class: "big" }, "🔒"), h("h2", {}, "Etapa " + n + " bloqueada"),
      h("p", { class: "muted" }, "Conclua a Etapa " + (n - 1) + " (" + C.stages[n - 1].title + ") para liberar esta etapa."),
      h("button", { class: "btn", onclick: () => go("etapa" + (n - 1)) }, "Ir para a Etapa " + (n - 1)));
  }

  /* ---- Autoavaliação ---- */
  const quizAns = {};
  function quizBlock(n) {
    const qs = C.quiz.filter(q => q.stage === n); if (!qs.length) return null;
    return h("div", { style: "margin-top:26px" },
      h("div", { class: "eyebrow" }, "Autoavaliação"), h("h2", { style: "margin:4px 0 4px" }, "Verifique o que aprendeu"),
      h("p", { class: "muted small" }, "Prática com feedback, não vale nota."),
      qs.map((q, i) => {
        const a = quizAns[q.id];
        const box = h("div", { class: "card", style: "margin-top:12px" }, h("span", { class: "tag" }, "QUESTÃO " + pad(i + 1) + " · " + q.domain), devBadge(q.status === "demo" ? "proposta" : ""), h("div", { class: "quiz-q" }, q.stem));
        q.options.forEach(([v, t]) => box.append(h("label", { class: "option" }, h("input", { type: "radio", name: q.id, value: v, checked: a && a.choice === v, disabled: !!a }), t)));
        box.append(h("button", { class: "btn", disabled: !!a, onclick: () => {
          const s = $(`input[name="${q.id}"]:checked`, box); if (!s) return;
          quizAns[q.id] = { choice: s.value, ok: s.value === q.answer };
          D.log("quiz_answer", { question: q.id, choice: s.value, correct: s.value === q.answer }); renderStage(n);
        } }, "Verificar resposta"));
        box.append(h("div", { class: "feedback" + (a ? " show " + (a.ok ? "good" : "bad") : "") }, a ? (a.ok ? q.ok : q.bad) : ""));
        return box;
      }));
  }

  /* ================= ETAPA 3 · DIAGNÓSTICO ================= */
  let tab3 = "passo";
  let wz = { steps: [], result: null };
  let cs = { order: null, i: 0, ans: {} };
  let tutorCtx = {};

  function renderStage3() {
    const root = $("#etapa3"), S = C.stages[3];
    if (!unlocked(3)) return put(root, lockBox(3));
    const tabs = [["passo", "Passo a passo"], ["casos", "Casos para praticar"], ["fluxo", "Fluxograma completo"]];
    put(root,
      h("div", { class: "eyebrow" }, S.short + " · " + S.title), h("h1", {}, S.title),
      h("p", { class: "muted" }, S.goal + " " + S.how),
      h("div", { class: "tabs" }, tabs.map(([k, t]) => h("button", { class: tab3 === k ? "active" : "", onclick: () => { tab3 = k; D.log("dx_tab", { tab: k }); renderStage3(); } }, t))),
      tab3 === "passo" ? wizardView() : tab3 === "casos" ? casesView() : flowView());
  }

  /* ---- passo a passo ---- */
  function nodeNow() { const last = wz.steps[wz.steps.length - 1]; return DG.nodes[last ? last.opt.next : DG.start]; }
  function crumbsOf(steps) { return h("div", { class: "crumbs" }, steps.map(s => h("span", {}, s.node.tag + ": " + s.opt.label))); }
  function choose(opt) {
    const nodeId = wz.steps.length ? wz.steps[wz.steps.length - 1].opt.next : DG.start;
    wz.steps.push({ nodeId, node: DG.nodes[nodeId], opt });
    D.log("dx_step", { node: nodeId, option: opt.label });
    if (opt.result) { wz.result = opt.result; D.log("dx_result", { dx: opt.result, path: wz.steps.map(s => s.nodeId + "=" + s.opt.label) }); }
    renderStage3();
  }
  function wizardView() {
    if (wz.result) return resultCard(wz.result);
    const node = nodeNow();
    return h("div", { class: "card" },
      wz.steps.length ? crumbsOf(wz.steps) : null,
      h("div", { class: "eyebrow" }, "Passo " + (wz.steps.length + 1)),
      h("h2", { style: "margin:6px 0" }, node.q, node.inferido ? devBadge("em validação") : null),
      node.help ? h("p", { class: "muted" }, node.help) : null,
      h("div", { class: "opts" }, node.options.map(o => h("button", { onclick: () => choose(o) }, o.label))),
      h("div", { style: "display:flex;gap:8px;flex-wrap:wrap" },
        wz.steps.length ? h("button", { class: "btn ghost", onclick: () => { wz.steps.pop(); renderStage3(); } }, "← Voltar um passo") : null,
        wz.steps.length ? h("button", { class: "btn ghost", onclick: () => { wz = { steps: [], result: null }; renderStage3(); } }, "Recomeçar") : null));
  }
  function infoGrid(d) {
    return h("div", { class: "info3" },
      h("div", {}, h("h4", {}, "Teste periapical"), h("p", {}, d.periapical)),
      h("div", {}, h("h4", {}, "Achados radiográficos"), h("p", {}, d.radio)),
      h("div", {}, h("h4", {}, "Achado clínico"), h("p", {}, d.clinico)));
  }
  function resultCard(id) {
    const d = DG.dx[id];
    const inferred = wz.steps.some(s => s.node.inferido);
    return h("div", { class: "card" },
      crumbsOf(wz.steps),
      h("div", { class: "dx-head", style: "border-color:" + d.cor }, h("div", { class: "eyebrow" }, "Diagnóstico sugerido pelo fluxograma"), h("h2", {}, d.nome), inferred ? devBadge("ramificação em validação") : null),
      infoGrid(d),
      h("div", { class: "two-col" },
        h("div", {}, h("h4", { style: "margin:0 0 6px" }, "Como isso aparece na imagem"), h("img", { class: "dx-img", src: "assets/dente-" + d.img + ".svg", alt: "Ilustração esquemática: " + d.nome }),
          h("div", { class: "small muted", style: "margin-top:6px" }, "Ilustração esquemática, apenas para orientar.")),
        h("div", {}, h("p", { class: "muted" }, "Confira se o caminho percorrido bate com os dados do seu caso. O diagnóstico final depende da avaliação clínica completa."),
          h("div", { style: "display:flex;gap:8px;flex-wrap:wrap" },
            d.lab && d.lab[1] ? h("button", { class: "btn secondary", onclick: () => { const items = C.lab.filter(l => l.stage === d.lab[0]); ls[d.lab[0]] = { item: Math.max(0, items.findIndex(l => l.id === d.lab[1])), region: null }; go("etapa" + d.lab[0]); } }, "Rever o achado no laboratório") : null,
            h("button", { class: "btn ghost", onclick: () => { tutorCtx = { diagnostico: id }; D.log("dx_open_tutor", { dx: id }); go("tutor"); } }, "Discutir com a tutora"),
            h("button", { class: "btn ghost", onclick: () => { wz.steps.pop(); wz.result = null; renderStage3(); } }, "← Voltar um passo"),
            h("button", { class: "btn", onclick: () => { wz = { steps: [], result: null }; renderStage3(); } }, "Novo caso")))));
  }

  /* ---- casos de prática (derivados do fluxograma) ---- */
  function leaves(nodeId, path, out) {
    DG.nodes[nodeId].options.forEach(o => {
      const p = path.concat([{ nodeId, node: DG.nodes[nodeId], opt: o }]);
      if (o.result) out.push({ dx: o.result, path: p }); else leaves(o.next, p, out);
    });
    return out;
  }
  function caseList() {
    if (!cs.order) {
      const all = leaves(DG.start, [], []);
      for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
      cs.order = all;
    }
    return cs.order;
  }
  function casesView() {
    const list = caseList(), c = list[cs.i], d = DG.dx[c.dx], a0 = cs.ans[cs.i], a = a0 && !a0.retry ? a0 : null;
    const hits = Object.values(cs.ans).filter(x => x.first).length;
    const sentences = c.path.map(p => p.opt.caso).filter(Boolean).join(" ");
    const card = h("div", { class: "card" },
      h("div", { style: "display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap" },
        h("span", { class: "tag" }, "CASO " + pad(cs.i + 1) + " DE " + pad(list.length)), devBadge("fictício, derivado do fluxograma"),
        h("span", { class: "score" }, "Acertos na 1ª tentativa: " + hits + " / " + Object.keys(cs.ans).length)),
      h("div", { class: "case-box" },
        h("p", {}, h("b", {}, "Anamnese e testes: "), "Paciente fictício. " + sentences),
        h("p", {}, h("b", {}, "Teste periapical (percussão): "), d.periapical),
        h("p", {}, h("b", {}, "Achados radiográficos: "), d.radio),
        h("p", {}, h("b", {}, "Exame clínico: "), d.clinico)),
      h("h3", {}, "Qual é o diagnóstico endodôntico?"),
      h("div", { class: "opts cols" }, Object.entries(DG.dx).map(([id, x]) => h("button", { disabled: a && (a.ok || a.revealed), onclick: () => answerCase(id) }, x.nome))));
    if (a && a.ok) card.append(h("div", { class: "feedback show good" }, "Correto! ", h("b", {}, d.nome), "."), crumbsOf(c.path));
    else if (a && a.revealed) card.append(h("div", { class: "feedback show bad" }, "O diagnóstico do caso é ", h("b", {}, d.nome), ". Caminho no fluxograma:"), crumbsOf(c.path));
    else if (a) card.append(h("div", { class: "feedback show bad" }, "Ainda não. Releia os dados e percorra o fluxograma: dor → teste pulpar → edema ou fístula → achados."),
      h("div", { style: "display:flex;gap:8px;margin-top:8px;flex-wrap:wrap" },
        h("button", { class: "btn ghost", onclick: () => { cs.ans[cs.i].retry = true; renderStage3(); } }, "Tentar de novo"),
        h("button", { class: "btn ghost", onclick: () => { cs.ans[cs.i].revealed = true; D.log("case_reveal", { case: cs.i, dx: c.dx }); renderStage3(); } }, "Ver a resposta")));
    card.append(h("div", { class: "quiz-nav" },
      h("button", { class: "btn ghost", disabled: cs.i === 0, onclick: () => { cs.i--; renderStage3(); } }, "← Anterior"),
      h("button", { class: "btn ghost", onclick: () => { tab3 = "passo"; wz = { steps: [], result: null }; renderStage3(); } }, "Usar o passo a passo"),
      h("button", { class: "btn", disabled: cs.i === list.length - 1, onclick: () => { cs.i++; renderStage3(); } }, "Próximo caso →")));
    return card;
  }
  function answerCase(id) {
    const list = caseList(), c = list[cs.i];
    const prev = cs.ans[cs.i]; const ok = id === c.dx;
    cs.ans[cs.i] = { choice: id, ok, first: prev ? prev.first : ok, attempts: (prev ? prev.attempts : 0) + 1, revealed: false, retry: false };
    D.log("case_answer", { case: cs.i, expected: c.dx, choice: id, correct: ok, attempt: cs.ans[cs.i].attempts });
    renderStage3();
  }

  /* ---- fluxograma completo ---- */
  function treeEl(nodeId) {
    const n = DG.nodes[nodeId];
    return h("ul", { class: nodeId === DG.start ? "tree" : "" }, h("li", {}, h("span", { class: "q" }, n.q),
      h("ul", {}, n.options.map(o => h("li", {}, h("span", { class: "opt" }, o.label), " → ", o.result ? h("span", { class: "res" }, DG.dx[o.result].nome) : treeEl(o.next))))));
  }
  function flowView() {
    return h("div", { class: "card" },
      h("p", { class: "muted" }, "Visão geral do fluxograma de condição clínica. Leia de cima para baixo: cada pergunta leva a um caminho até o diagnóstico."),
      treeEl(DG.start),
      h("details", {}, h("summary", {}, "Ver a figura original do fluxograma"), h("img", { src: "assets/fluxograma-original.jpg", alt: "Fluxograma de condição clínica: dor, testes pulpar e periapical, diagnóstico" })));
  }

  /* ================= TUTORA ================= */
  function renderTutor() {
    const msgs = h("div", { class: "messages", id: "messages" }, h("div", { class: "bubble bot" }, T.welcome));
    const input = h("input", { id: "chatInput", placeholder: "Digite sua dúvida...", autocomplete: "off", "aria-label": "Pergunta para a tutora" });
    const form = h("form", { class: "chat-form" }, input, h("button", { class: "btn", type: "submit" }, "Enviar"));
    form.addEventListener("submit", async e => {
      e.preventDefault(); const q = input.value.trim(); if (!q) return;
      msgs.append(h("div", { class: "bubble user" }, q)); input.value = "";
      const wait = h("div", { class: "bubble bot typing" }, "digitando…"); msgs.append(wait); msgs.scrollTop = msgs.scrollHeight;
      D.log("tutor_question", { text: q, context: tutorCtx });
      const r = await T.ask(q, tutorCtx);
      wait.className = "bubble bot"; wait.textContent = r.text; msgs.scrollTop = msgs.scrollHeight;
      D.log("tutor_answer", { text: r.text, mode: r.mode });
    });
    put($("#tutor"),
      h("div", { class: "eyebrow" }, "Apoio ao raciocínio"), h("h1", {}, "Tutora virtual"),
      h("p", { class: "muted" }, T.mode() === "ia" ? "Tutora com inteligência artificial, restrita ao conteúdo do ambiente." : "Versão de demonstração: respostas pré-programadas e baseadas no fluxograma. Ainda não está conectada a um modelo de IA."),
      h("div", { class: "card chat", style: "margin-top:18px" }, msgs, form,
        h("div", { class: "small muted" }, "Não insira dados pessoais ou informações de pacientes. Suas perguntas podem ser registradas para fins da pesquisa.")));
  }

  /* ================= PESQUISADOR ================= */
  function download(name, text, mime) {
    const a = h("a", { href: URL.createObjectURL(new Blob([text], { type: mime })), download: name });
    document.body.append(a); a.click(); a.remove();
  }
  function renderResearcher() {
    const ev = D.events(); const last = ev.slice(-15).reverse();
    put($("#pesquisador"),
      h("div", { class: "eyebrow" }, "Uso do pesquisador"), h("h1", {}, "Registros deste navegador"),
      h("p", { class: "muted" }, "Eventos guardados neste navegador" + (D.remoteEnabled() ? " e enviados ao servidor." : ". O envio ao servidor (Supabase) ainda não está configurado.")),
      h("div", { class: "card", style: "margin-top:18px" },
        h("p", {}, h("b", {}, String(ev.length)), " eventos registrados."),
        h("div", { style: "display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px" },
          h("button", { class: "btn secondary", onclick: () => download("radiendo-eventos.csv", D.toCSV(), "text/csv;charset=utf-8") }, "Baixar CSV"),
          h("button", { class: "btn ghost", onclick: () => download("radiendo-eventos.json", D.toJSON(), "application/json") }, "Baixar JSON"),
          h("button", { class: "btn ghost", onclick: () => { if (confirm("Apagar os registros locais deste navegador?")) { D.clear(); renderResearcher(); } } }, "Apagar registros locais")),
        h("div", { class: "table-wrap" }, h("table", { class: "t" },
          h("thead", {}, h("tr", {}, ["Hora", "Código", "Tipo", "Página", "Dados"].map(x => h("th", {}, x)))),
          h("tbody", {}, last.map(e => h("tr", {}, h("td", {}, e.ts.slice(11, 19)), h("td", {}, e.code), h("td", {}, e.type), h("td", {}, e.page), h("td", {}, JSON.stringify(e.payload).slice(0, 70)))))))));
  }

  /* ================= SESSÃO ================= */
  function refreshSession() {
    const p = D.isParticipant();
    $("#avatar").textContent = p ? D.getSession().code.slice(0, 2) : "VI";
    $("#who").textContent = p ? "Participante " + D.getSession().code : "Visitante (sem registro)";
    $("#sessionBtn").textContent = p ? "Sair" : "Identificar-se";
    $("#sideFoot").innerHTML = "Versão " + CFG.versao + (DEV ? "<br>Conteúdo em desenvolvimento" : "");
    refreshNav();
  }
  function openLogin() { $("#codeError").textContent = ""; $("#codeInput").value = ""; $("#loginOverlay").hidden = false; setTimeout(() => $("#codeInput").focus(), 30); }
  function closeLogin() { $("#loginOverlay").hidden = true; }
  function resetState() { wz = { steps: [], result: null }; cs = { order: null, i: 0, ans: {} }; ls[1] = { item: 0, region: null }; ls[2] = { item: 0, region: null }; Object.keys(quizAns).forEach(k => delete quizAns[k]); tutorCtx = {}; }
  function sessionChanged() { resetState(); refreshSession(); renderTutor(); route(); }

  /* ================= INICIALIZAÇÃO ================= */
  function init() {
    renderTutor();
    $$("#nav button").forEach(b => b.addEventListener("click", () => go(b.dataset.page)));
    $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#sessionBtn").addEventListener("click", () => { if (D.isParticipant()) { D.end(); sessionChanged(); } else openLogin(); });
    $("#visitorBtn").addEventListener("click", () => { D.visitor(); closeLogin(); sessionChanged(); });
    $("#loginForm").addEventListener("submit", e => {
      e.preventDefault();
      if (D.start($("#codeInput").value)) { closeLogin(); sessionChanged(); }
      else $("#codeError").textContent = "Código inválido. Use de 3 a 20 letras, números ou hífen.";
    });
    window.addEventListener("hashchange", route);
    refreshSession(); route();
    if (!D.isParticipant() && !askedOnce()) openLogin();
  }
  function askedOnce() { try { if (sessionStorage.getItem("radiendo.asked")) return true; sessionStorage.setItem("radiendo.asked", "1"); } catch (e) {} return false; }
  document.addEventListener("DOMContentLoaded", init);
})();
