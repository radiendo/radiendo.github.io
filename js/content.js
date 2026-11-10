/* ============================================================
   RadiEndo · CONTEÚDO DAS ETAPAS 1 E 2
   (O diagnóstico, Etapa 3, está em diagnostico.js.)
   Trilha: 1 Normalidade  ->  2 Alterações  ->  3 Diagnóstico.

   TODO o texto abaixo é uma PROPOSTA INICIAL (status "demo") para
   revisão da autora e dos especialistas. Nada foi validado.
   Para usar radiografias reais: coloque o arquivo em assets/img/,
   informe src e viewBox (pixels da imagem) e desenhe cada região em
   `path` com as coordenadas da imagem; real:true remove o aviso de
   "ilustração".

   LISTA PREVISTA PARA A ETAPA 1 (ainda falta imagem real):
   pontos de referência anatômicos — seio maxilar, assoalho da cavidade
   nasal, fossa nasal, forame incisivo, sutura intermaxilar, canal
   mandibular, forame mentual, linha oblíqua externa, linha milo-hióidea.
   ============================================================ */
(function () {
  const G = window.RADIENDO_GEO;

  window.RADIENDO_CONTENT = {

    stages: {
      1: { title: "Normalidade", short: "Etapa 1", icon: "◎",
        goal: "Reconhecer as estruturas anatômicas normais de um dente e de seus tecidos de suporte na radiografia periapical.",
        how: "Clique em cada região da imagem. Ao explorar todas, a Etapa 2 é liberada." },
      2: { title: "Alterações", short: "Etapa 2", icon: "△",
        goal: "Reconhecer as alterações radiográficas que afetam essas estruturas e que podem ter interesse endodôntico.",
        how: "Explore cada alteração e compare com a normalidade. Ao explorar todas, a Etapa 3 é liberada." },
      3: { title: "Diagnóstico endodôntico", short: "Etapa 3", icon: "✧",
        goal: "Integrar queixa, testes clínicos e achados radiográficos para chegar a um diagnóstico endodôntico.",
        how: "Percorra o fluxograma passo a passo e pratique com casos clínicos." }
    },

    /* ---- LABORATÓRIO: imagens com regiões clicáveis ---- */
    lab: [
      { id: "normal", stage: 1, title: "Dente e tecidos de suporte", real: false, status: "demo",
        src: "assets/dente-normal.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática de um dente normal e do periodonto",
        regions: [
          { id: "bone", label: "Osso alveolar (trabeculado)", path: G.BONE,
            text: "O osso esponjoso aparece como um padrão de trabéculas radiopacas e espaços medulares radiolúcidos. O padrão varia entre maxila e mandíbula e entre pacientes; conhecer o padrão normal ajuda a perceber quando ele se altera." },
          { id: "peri", label: "Região periapical", path: G.PERI,
            text: "Região ao redor do ápice radicular. Em condições normais, a lâmina dura é contínua ao redor do ápice, o espaço do ligamento periodontal tem largura uniforme e não há área radiolúcida circunscrita." },
          { id: "ld", label: "Lâmina dura", path: G.LD,
            text: "Linha radiopaca fina que acompanha o contorno do alvéolo, imediatamente externa ao espaço do ligamento periodontal. Em dentes sem alteração, costuma ser contínua." },
          { id: "pdl", label: "Espaço do ligamento periodontal", path: G.PDL,
            text: "Linha radiolúcida fina entre a raiz e a lâmina dura, de largura relativamente uniforme ao longo da raiz. Mudanças localizadas na largura merecem atenção." },
          { id: "crest", label: "Crista óssea alveolar", path: G.CREST,
            text: "Margem coronal do osso alveolar. Em geral situa-se cerca de 1 a 2 mm apical à junção amelocementária e se continua com a lâmina dura." },
          { id: "dentin", label: "Dentina", path: G.T,
            text: "Forma o corpo do dente e é menos radiopaca que o esmalte. O cemento, que reveste a raiz, tem radiopacidade semelhante à da dentina e normalmente não é distinguido dela na radiografia." },
          { id: "enamel", label: "Esmalte", path: G.ENAMEL,
            text: "É o tecido mais radiopaco do dente e aparece como uma camada brilhante que recobre a coroa." },
          { id: "chamber", label: "Câmara pulpar", path: G.CH,
            text: "Espaço radiolúcido no interior da coroa, ocupado pelo tecido pulpar. Com a idade, a deposição de dentina reduz progressivamente seu volume." },
          { id: "canal", label: "Canal radicular", path: G.CA,
            text: "Continuação radiolúcida da câmara pulpar pela raiz, que se afila em direção ao ápice. Acompanhá-lo até o ápice faz parte da avaliação; variações como canais adicionais ou curvaturas nem sempre aparecem em uma única incidência." }
        ] },

      { id: "carie", stage: 2, title: "Cárie profunda", real: false, status: "demo",
        src: "assets/dente-carie.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: cárie profunda próxima à câmara pulpar",
        diagnoses: ["pis", "pia"],
        regions: [
          { id: "carie", label: "Área radiolúcida na coroa (cárie)", path: G.CARIE,
            text: "A desmineralização da dentina aparece como área radiolúcida na coroa. Quanto mais próxima da câmara pulpar, maior a chance de comprometimento pulpar. A radiografia costuma subestimar a profundidade real da lesão, por isso deve ser associada ao exame clínico." },
          { id: "chamber", label: "Câmara pulpar (proximidade)", path: G.CH,
            text: "Observe a distância entre o fundo da lesão e a câmara pulpar. A proximidade ou a exposição pulpar é um dado importante para o raciocínio diagnóstico." }
        ] },

      { id: "restauracao", stage: 2, title: "Restauração extensa", real: false, status: "demo",
        src: "assets/dente-restauracao.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: restauração extensa próxima à câmara pulpar",
        diagnoses: ["pis"],
        regions: [
          { id: "rest", label: "Material restaurador (radiopaco)", path: G.REST,
            text: "Os materiais restauradores aparecem mais radiopacos que os tecidos dentais (a intensidade varia com o material). Restaurações extensas ou profundas, e cáries sob restaurações, podem estar associadas a comprometimento pulpar: avalie a adaptação e a proximidade com a polpa." },
          { id: "chamber", label: "Câmara pulpar", path: G.CH,
            text: "Verifique a relação entre o limite profundo da restauração e a câmara pulpar." }
        ] },

      { id: "espessamento", stage: 2, title: "Espessamento do ligamento periodontal", real: false, status: "demo",
        src: "assets/dente-espessamento.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: alargamento do espaço do ligamento periodontal (mais evidente no ápice)",
        diagnoses: ["aaa", "paa", "pct", "pia", "pr"],
        regions: [
          { id: "pdlw", label: "Espaço do ligamento periodontal alargado", path: G.PDLW,
            text: "O espaço do ligamento periodontal está mais largo que o normal, em geral de forma mais evidente na região apical. Reflete resposta inflamatória do ligamento. É um achado inespecífico: aparece em diferentes condições e, por isso, deve ser interpretado junto com os testes clínicos. Pode ser discreto; compare com os dentes vizinhos." },
          { id: "ldw", label: "Lâmina dura (contínua)", path: G.LDW,
            text: "Neste exemplo a lâmina dura continua visível ao redor de toda a raiz. A manutenção da continuidade ajuda a diferenciar o espessamento do ligamento de perdas ósseas mais avançadas." }
        ] },

      { id: "lesao", stage: 2, title: "Radiolucidez periapical", real: false, status: "demo",
        src: "assets/dente-lesao.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: área radiolúcida periapical com perda da lâmina dura apical",
        diagnoses: ["apc", "pac"],
        regions: [
          { id: "lesao", label: "Área radiolúcida periapical", path: G.LESAO,
            text: "Área escura ao redor do ápice, associada à perda óssea de origem inflamatória. Radiograficamente, lesões periapicais diferentes podem ter aspecto parecido, então a correlação clínica é indispensável. A perda mineral precisa ser suficiente para aparecer: nas fases iniciais a radiografia pode estar normal ou apenas com leve espessamento do ligamento." },
          { id: "ldend", label: "Lâmina dura (interrompida no ápice)", path: G.LDEND,
            text: "Perceba onde a lâmina dura deixa de ser visualizada: na região periapical afetada, a linha radiopaca perde a continuidade." }
        ] }
    ],

    /* ---- AUTOAVALIAÇÃO (prática formativa; NÃO é o pré/pós-teste) ---- */
    quiz: [
      { id: "q1", stage: 1, domain: "ANATOMIA", status: "demo",
        stem: "Qual estrutura radiográfica corresponde à linha radiopaca que contorna o alvéolo dentário, externamente ao espaço do ligamento periodontal?",
        options: [["a", "Espaço do ligamento periodontal"], ["b", "Lâmina dura"], ["c", "Trabeculado ósseo"], ["d", "Câmara pulpar"]],
        answer: "b",
        ok: "Correto! A lâmina dura é a linha radiopaca que delimita o alvéolo.",
        bad: "Revise: a estrutura descrita é a lâmina dura, uma linha radiopaca." },
      { id: "q2", stage: 1, domain: "ANATOMIA", status: "demo",
        stem: "Em um dente sem alteração, o espaço do ligamento periodontal aparece como:",
        options: [["a", "Linha radiolúcida fina e de largura uniforme entre a raiz e a lâmina dura"], ["b", "Linha radiopaca contínua ao redor da coroa"], ["c", "Área radiolúcida circunscrita ao redor do ápice"], ["d", "Faixa radiopaca larga acompanhando a raiz"]],
        answer: "a",
        ok: "Correto! É uma linha radiolúcida fina e uniforme.",
        bad: "Revise: o ligamento periodontal é radiolúcido e fino, entre a raiz e a lâmina dura." },
      { id: "q3", stage: 2, domain: "ALTERAÇÕES", status: "demo",
        stem: "Por que o espessamento do espaço do ligamento periodontal, isoladamente, não define um diagnóstico?",
        options: [["a", "Porque é um achado inespecífico, presente em diferentes condições, e deve ser correlacionado com os testes clínicos"], ["b", "Porque só ocorre em dentes normais"], ["c", "Porque é sempre sinal de lesão crônica"], ["d", "Porque a radiografia nunca mostra o ligamento"]],
        answer: "a",
        ok: "Correto! O achado precisa ser interpretado junto com queixa e testes.",
        bad: "Revise: o espessamento é inespecífico e deve ser correlacionado com a clínica." },
      { id: "q4", stage: 2, domain: "ALTERAÇÕES", status: "demo",
        stem: "Uma área radiolúcida periapical com perda da continuidade da lâmina dura apical sugere:",
        options: [["a", "Variação normal que dispensa avaliação"], ["b", "Perda óssea de origem inflamatória, a ser correlacionada com os testes clínicos"], ["c", "Material restaurador radiopaco"], ["d", "Câmara pulpar ampla"]],
        answer: "b",
        ok: "Correto! Sugere reabsorção óssea inflamatória, que precisa da correlação clínica.",
        bad: "Revise: radiolucidez periapical com perda da lâmina dura sugere perda óssea inflamatória." }
    ],

    /* ---- TUTORA (modo simulado) ---- */
    tutor: {
      welcome: "Olá! Sou a tutora do RadiEndo (versão de demonstração). Posso ajudar com as estruturas normais, as alterações radiográficas e o raciocínio diagnóstico. Pergunte, por exemplo, sobre lâmina dura, espessamento do ligamento periodontal ou sobre um diagnóstico do fluxograma.",
      fallback: "Ainda não tenho IA conectada, então respondo a poucos temas. Tente perguntar sobre lâmina dura, ligamento periodontal, radiolucidez periapical, ou o nome de um diagnóstico do fluxograma (por exemplo, \"periodontite apical aguda\").",
      replies: [
        { keys: ["lâmina dura", "lamina dura"], text: "A lâmina dura é a linha radiopaca que acompanha o contorno do alvéolo, externa ao espaço do ligamento periodontal. Em dentes sem alteração costuma ser contínua. Onde ela perde a continuidade, o que isso pode indicar?" },
        { keys: ["espaço periodontal", "ligamento periodontal", "espessamento"], text: "O espaço do ligamento periodontal é uma linha radiolúcida fina e uniforme. Seu alargamento é um achado inespecífico, que aparece em diferentes diagnósticos; por isso precisa ser combinado com queixa e testes clínicos." },
        { keys: ["radiolucidez", "radiolúcida", "radiolucida", "lesão", "lesao"], text: "Uma área radiolúcida periapical sugere perda óssea de origem inflamatória, mas a imagem isolada não estabelece o diagnóstico. Qual a queixa do paciente e como estão os testes pulpar e periapical?" },
        { keys: ["fluxograma", "como diagnosticar", "como chegar", "diagnóstico", "diagnostico"], text: "No fluxograma, comece pelo tipo de dor (espontânea, provocada ou sem dor), depois o teste de sensibilidade pulpar e, conforme o caso, edema ou fístula. Os achados radiográficos confirmam o raciocínio. Use o passo a passo na Etapa 3. Em qual passo você está em dúvida?" }
      ]
    }
  };
})();
