/* ============================================================
   RadiEndo · TUTORA
   Interface única: RadiTutor.ask(pergunta, contexto) -> Promise<{text,mode}>
   Hoje: modo simulado (respostas pré-programadas + dados do fluxograma).
   Depois: modo "remote", chamando uma função segura no servidor
   (a chave do modelo de IA NUNCA fica no navegador). Para ligar,
   preencha tutorEndpoint em config.js — o resto do site não muda.
   ============================================================ */
(function () {
  const C = window.RADIENDO_CONTENT.tutor;
  const DX = window.RADIENDO_DIAG.dx;
  const CFG = window.RADIENDO_CONFIG || {};
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function dxText(d) {
    return d.nome + ": teste periapical — " + d.periapical + " Achados radiográficos — " + d.radio + " Achado clínico — " + d.clinico;
  }

  async function simulated(q) {
    const n = norm(q);
    await new Promise(r => setTimeout(r, 350));
    // 1) nome de diagnóstico do fluxograma
    const hits = Object.values(DX).filter(d => n.includes(norm(d.nome)));
    if (hits.length) return { text: hits.map(dxText).join("\n\n"), mode: "simulado" };
    const gen = ["pulpite", "periodontite", "abscesso", "pericementite", "normalidade"].filter(w => n.includes(w));
    if (gen.length) {
      const list = Object.values(DX).filter(d => gen.some(w => norm(d.nome).includes(w)));
      return { text: "Há mais de um diagnóstico com esse nome no fluxograma: " + list.map(d => d.nome).join("; ") + ". Pergunte pelo nome completo para eu detalhar os achados.", mode: "simulado" };
    }
    // 2) conteúdo das etapas 1 e 2
    const m = C.replies.find(r => r.keys.some(k => n.includes(norm(k))));
    return { text: m ? m.text : C.fallback, mode: "simulado" };
  }

  async function remote(q, ctx) {
    const r = await fetch(CFG.tutorEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, context: ctx })
    });
    if (!r.ok) throw new Error("tutor " + r.status);
    const j = await r.json();
    return { text: j.answer, mode: "ia" };
  }

  window.RadiTutor = {
    mode() { return CFG.tutorEndpoint ? "ia" : "simulado"; },
    welcome: C.welcome,
    async ask(q, ctx) {
      if (CFG.tutorEndpoint) { try { return await remote(q, ctx); } catch (e) { /* cai para o simulado */ } }
      return simulated(q);
    }
  };
})();
