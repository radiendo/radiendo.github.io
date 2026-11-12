/* ============================================================
   RadiEndo · FLUXOGRAMA DE DIAGNÓSTICO ENDODÔNTICO
   Transcrição do fluxograma "Condição clínica" enviado pela autora.
   É a ÚNICA fonte do raciocínio diagnóstico: o passo a passo, os
   casos de prática, a tela do fluxograma e a tutora leem daqui.
   (No futuro, a IA também será restrita a este conteúdo.)

   PONTOS A CONFIRMAR COM A ORIENTADORA / ESPECIALISTAS
   - Marcados com inferido:true: no fluxograma original, duas
     ramificações não têm pergunta escrita (teste pulpar positivo
     em "Dor provocada" e em "Sem dor"). A pergunta usada aqui foi
     deduzida dos cartões; confirmar se é o critério desejado.
   - Fonte: elaborado pela autora e adaptado do guia de diagnóstico da AAE (2013).
   - Regra da autora: dor que persiste por mais de 30 s após o teste de sensibilidade
     indica pulpite irreversível; sem queixa de dor = assintomática; com histórico de
     dor espontânea = sintomática. O caso "dor provocada + resposta prolongada ->
     pulpite irreversível sintomática" é extensão a confirmar (inferido:true).
   ============================================================ */
window.RADIENDO_DIAG = {
  start: "dor",

  /* ---- ÁRVORE DE DECISÃO ----
     Cada nó tem uma pergunta e opções. Uma opção leva a outro nó
     (next) ou a um diagnóstico (result). `caso` é a frase usada
     para montar os casos de prática. */
  nodes: {
    dor: { tag: "Dor", q: "Como é a dor relatada pelo paciente?",
      help: "Comece pela queixa: dor espontânea, dor provocada por estímulo ou ausência de dor.",
      options: [
        { label: "Dor espontânea", caso: "Relata dor espontânea.", next: "esp_pulpar" },
        { label: "Dor provocada", caso: "Relata dor provocada por estímulo.", next: "prov_pulpar" },
        { label: "Sem dor", caso: "Não relata dor.", next: "sem_pulpar" } ] },

    /* Dor espontânea */
    esp_pulpar: { tag: "Teste pulpar", q: "Qual é o resultado do teste de sensibilidade pulpar?", options: [
      { label: "Positivo", caso: "Teste de sensibilidade pulpar: positivo.", result: "pis" },
      { label: "Negativo", caso: "Teste de sensibilidade pulpar: negativo.", next: "esp_edema" } ] },
    esp_edema: { tag: "Edema", q: "Há edema?", options: [
      { label: "Sim", caso: "Há edema.", result: "aaa" },
      { label: "Não", caso: "Não há edema.", result: "paa" } ] },

    /* Dor provocada */
    prov_pulpar: { tag: "Teste pulpar", q: "Qual é o resultado do teste de sensibilidade pulpar?", options: [
      { label: "Positivo", caso: "Teste de sensibilidade pulpar: positivo.", next: "prov_resp" },
      { label: "Negativo", caso: "Teste de sensibilidade pulpar: negativo.", result: "paa" } ] },
    prov_resp: { tag: "Resposta ao teste", inferido: true, q: "Após o teste de sensibilidade, a dor persiste por mais de 30 segundos?",
      help: "Dor que cessa em poucos segundos sugere comprometimento reversível; dor que persiste por mais de 30 segundos sugere pulpite irreversível.",
      options: [
        { label: "Não, cessa em poucos segundos", caso: "A dor após o teste de sensibilidade cessou em poucos segundos.", next: "prov_peri" },
        { label: "Sim, persiste por mais de 30 segundos", caso: "A dor após o teste de sensibilidade persistiu por mais de 30 segundos.", result: "pis",
          clinico: "Dor provocada por estímulo térmico que persiste por mais de 30 segundos após o teste." } ] },
    prov_peri: { tag: "Teste periapical", inferido: true, q: "Como é o teste periapical (percussão)?",
      help: "Com teste pulpar positivo, o teste periapical ajuda a separar o comprometimento pulpar do periodontal.",
      options: [
        { label: "Geralmente negativo", result: "pr" },
        { label: "Positivo", result: "pct" } ] },

    /* Sem dor */
    sem_pulpar: { tag: "Teste pulpar", q: "Qual é o resultado do teste de sensibilidade pulpar?", options: [
      { label: "Positivo", caso: "Teste de sensibilidade pulpar: positivo.", next: "sem_resp" },
      { label: "Negativo", caso: "Teste de sensibilidade pulpar: negativo.", next: "sem_fistula" } ] },
    sem_resp: { tag: "Resposta ao teste", q: "Após o teste de sensibilidade, a resposta persiste por mais de 30 segundos?",
      help: "Sem queixa de dor: resposta breve indica polpa normal; resposta que persiste por mais de 30 segundos indica pulpite irreversível assintomática.",
      options: [
        { label: "Sim, persiste por mais de 30 segundos", caso: "A resposta ao teste de sensibilidade persistiu por mais de 30 segundos.", result: "pia" },
        { label: "Não, resposta breve", caso: "A resposta ao teste de sensibilidade foi breve.", result: "norm" } ] },
    sem_fistula: { tag: "Fístula", q: "Há fístula?", options: [
      { label: "Sim", caso: "Há fístula.", result: "apc" },
      { label: "Não", caso: "Não há fístula.", result: "pac" } ] }
  },

  /* ---- DIAGNÓSTICOS ----
     img: ilustração esquemática (normal, carie, espessamento, lesao)
     lab: [etapa, item do laboratório] para "rever o achado".        */
  dx: {
    pis: { nome: "Pulpite irreversível sintomática", cor: "#6b2a8a", img: "carie", lab: [2, "carie"],
      periapical: "Normal ou levemente sensível.",
      radio: "Espaço do ligamento periodontal normal; cárie profunda ou restauração extensa.",
      clinico: "Dor espontânea, latejante, prolongada e exacerbada por estímulos térmicos." },
    aaa: { nome: "Abscesso periapical agudo", cor: "#c2358f", img: "espessamento", lab: [2, "espessamento"],
      periapical: "Altamente positivo e doloroso à percussão.",
      radio: "Ligamento periodontal normal; ou levemente espessado.",
      clinico: "Dor intensa, sensação de dente crescido, edema e possível febre." },
    paa: { nome: "Periodontite apical aguda", cor: "#2a9aa6", img: "espessamento", lab: [2, "espessamento"],
      periapical: "Fortemente positivo à percussão.",
      radio: "Ligamento periodontal discretamente espessado (pode haver leve espessamento do ligamento periodontal).",
      clinico: "Dor constante, localizada, agravada por mastigação." },
    pr: { nome: "Pulpite reversível", cor: "#3a2f9a", img: "normal", lab: [1, null],
      periapical: "Geralmente negativo.",
      radio: "Pode haver leve espessamento do ligamento periodontal.",
      clinico: "Dor provocada que cessa com a remoção do estímulo." },
    pct: { nome: "Pericementite por trauma", cor: "#7a3b1d", img: "espessamento", lab: [2, "espessamento"],
      periapical: "Positivo.",
      radio: "Pode haver leve espessamento do ligamento periodontal.",
      clinico: "Dor à mastigação, trauma oclusal, sensibilidade à mastigação." },
    pia: { nome: "Pulpite irreversível assintomática", cor: "#4b3aa8", img: "carie", lab: [2, "carie"],
      periapical: "Normal.",
      radio: "Pode haver leve espessamento do ligamento periodontal.",
      clinico: "Geralmente assintomática, pode haver desconforto leve. Exposição pulpar por cárie profunda." },
    norm: { nome: "Normalidade", cor: "#b8860b", img: "normal", lab: [1, null],
      periapical: "Normal.",
      radio: "Estruturas anatômicas normais, ligamento periodontal uniforme.",
      clinico: "Ausência de dor ou inflamação; resposta positiva ao teste pulpar." },
    apc: { nome: "Abscesso periapical crônico", cor: "#2f6b3a", img: "lesao", lab: [2, "lesao"],
      periapical: "Geralmente negativo (ou levemente dolorido).",
      radio: "Área radiolúcida (reabsorção óssea crônica).",
      clinico: "Presença de fístula com pus; dente geralmente assintomático." },
    pac: { nome: "Periodontite apical crônica", cor: "#1f7f8a", img: "lesao", lab: [2, "lesao"],
      periapical: "Negativo (pode haver sensibilidade).",
      radio: "Área radiolúcida (reabsorção óssea crônica).",
      clinico: "Dente assintomático, sem fístula ativa." }
  }
};
