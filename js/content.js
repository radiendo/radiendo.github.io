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

   ETAPA 1: dente esquemático + 5 regiões radiográficas (anterior
   superior; pré-molares/molares superiores; anterior inferior;
   pré-molares inferiores; molares inferiores). Itens com src:null
   aparecem como "imagem em preparação": a lista de estruturas e os
   textos já funcionam; quando a radiografia real estiver disponível,
   informe src/viewBox e desenhe o path de cada região.
   ETAPA 2: 9 alterações (4 + 5 novas). Itens com `nota` mostram um
   aviso (ex.: achado fora do fluxograma).
   ============================================================ */
(function () {
  const G = window.RADIENDO_GEO;

  window.RADIENDO_CONTENT = {

    stages: {
      1: { title: "Normalidade", short: "Etapa 1", icon: "◎",
        goal: "Reconhecer as estruturas anatômicas normais de um dente e de seus tecidos de suporte na radiografia periapical.",
        how: "Clique em cada região da imagem. Ao explorar a maior parte das regiões, a Etapa 2 é liberada." },
      2: { title: "Alterações", short: "Etapa 2", icon: "△",
        goal: "Reconhecer as alterações radiográficas que afetam essas estruturas e que podem ter interesse endodôntico.",
        how: "Explore cada alteração e compare com a normalidade. Ao explorar a maior parte, a Etapa 3 é liberada." },
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

      { id: "ant_sup", stage: 1, title: "Região anterior superior", real: false, status: "demo",
        src: null, viewBox: "0 0 520 390",
        caption: "Periapical de incisivos e caninos superiores (imagem em preparação)",
        regions: [
          { id: "ldp", label: "Lâmina dura e ligamento periodontal", path: null,
            text: "A lâmina dura é a linha radiopaca do alvéolo e o espaço do ligamento periodontal é a linha radiolúcida fina entre ela e a raiz. Compare a continuidade e a largura ao longo de toda a raiz." },
          { id: "crista", label: "Crista óssea alveolar", path: null,
            text: "Margem coronal do osso alveolar, normalmente 1 a 2 mm apical à junção amelocementária, contínua com a lâmina dura." },
          { id: "fossa", label: "Fossa nasal", path: null,
            text: "Área radiolúcida escura acima dos ápices dos incisivos, limitada inferiormente pelo assoalho da cavidade nasal. Pode se sobrepor à região periapical e simular uma lesão." },
          { id: "septo", label: "Septo nasal", path: null,
            text: "Faixa radiopaca vertical na linha média, dividindo as fossas nasais." },
          { id: "ena", label: "Espinha nasal anterior", path: null,
            text: "Pequena projeção radiopaca em forma de V na base do septo, na linha média, acima dos incisivos centrais." },
          { id: "forame", label: "Forame incisivo", path: null,
            text: "Área radiolúcida arredondada ou oval entre os incisivos centrais, apical às raízes. Pode ser confundido com lesão periapical; mudar a angulação do feixe desloca sua posição em relação aos ápices, o que não ocorre com uma lesão verdadeira." }
        ] },

      { id: "post_sup", stage: 1, title: "Pré-molares e molares superiores", real: false, status: "demo",
        src: null, viewBox: "0 0 520 390",
        caption: "Periapical de pré-molares e molares superiores (imagem em preparação)",
        regions: [
          { id: "ldp", label: "Lâmina dura e ligamento periodontal", path: null,
            text: "Acompanhe a lâmina dura e a linha radiolúcida do ligamento ao redor de cada raiz, comparando com os dentes vizinhos." },
          { id: "seio", label: "Seio maxilar (assoalho e recessos)", path: null,
            text: "Cavidade radiolúcida acima dos ápices, limitada por uma linha radiopaca fina (assoalho). Os recessos se estendem entre as raízes e os ápices podem parecer dentro do seio, sem que haja alteração." },
          { id: "proc_zig", label: "Processo zigomático da maxila", path: null,
            text: "Radiopacidade em forma de ‘U’ invertido ou ‘J’ acima dos molares, resultante do pilar zigomático." },
          { id: "zig", label: "Sombra do osso zigomático", path: null,
            text: "Radiopacidade difusa e homogênea que se sobrepõe à região dos molares e do seio, em geral mais evidente na região do primeiro molar." },
          { id: "tuber", label: "Túber da maxila", path: null,
            text: "Região posterior do rebordo, de trabeculado mais frouxo e aspecto arredondado, distal ao último molar." },
          { id: "coronoide", label: "Processo coronoide da mandíbula", path: null,
            text: "Radiopacidade triangular sobreposta à região do túber, mais visível com a boca bem aberta ou em incidências de molares superiores." }
        ] },

      { id: "ant_inf", stage: 1, title: "Região anterior inferior", real: false, status: "demo",
        src: null, viewBox: "0 0 520 390",
        caption: "Periapical de incisivos e caninos inferiores (imagem em preparação)",
        regions: [
          { id: "ldp", label: "Lâmina dura, ligamento periodontal e crista óssea", path: null,
            text: "Linha radiopaca da lâmina dura, linha radiolúcida do ligamento e a crista óssea, de contorno mais fino nesta região por serem as raízes mais estreitas." },
          { id: "forames", label: "Forames linguais", path: null,
            text: "Pequena área radiolúcida arredondada na linha média, abaixo dos ápices dos incisivos, circundada por um halo radiopaco (canal lingual)." },
          { id: "geniano", label: "Tubérculos genianos (apófises genis)", path: null,
            text: "Radiopacidade em anel ou massa ao redor dos forames linguais, formada pelas inserções musculares na face lingual da sínfise." }
        ] },

      { id: "pm_inf", stage: 1, title: "Pré-molares inferiores", real: false, status: "demo",
        src: null, viewBox: "0 0 520 390",
        caption: "Periapical de pré-molares inferiores (imagem em preparação)",
        regions: [
          { id: "ldp", label: "Lâmina dura e ligamento periodontal", path: null,
            text: "Verifique a continuidade da lâmina dura e a uniformidade do espaço periodontal em cada raiz." },
          { id: "mentual", label: "Forame mentual", path: null,
            text: "Área radiolúcida arredondada ou oval, geralmente entre ou abaixo dos ápices dos pré-molares, que pode simular lesão periapical. Mudar a angulação desloca sua posição em relação ao ápice." },
          { id: "canal_m", label: "Canal mandibular (quando visível)", path: null,
            text: "Faixa radiolúcida estreita, delimitada por duas linhas radiopacas, que segue abaixo dos ápices. Nem sempre é visível neste recorte." }
        ] },

      { id: "mol_inf", stage: 1, title: "Molares inferiores", real: false, status: "demo",
        src: null, viewBox: "0 0 520 390",
        caption: "Periapical de molares inferiores (imagem em preparação)",
        regions: [
          { id: "ldp", label: "Lâmina dura e ligamento periodontal", path: null,
            text: "Acompanhe as raízes mesial e distal e a região de furca, comparando a continuidade e a largura do ligamento." },
          { id: "canal_m", label: "Canal mandibular", path: null,
            text: "Faixa radiolúcida delimitada por linhas radiopacas, abaixo dos ápices. A proximidade dos ápices é relevante, mas a sobreposição pode ser apenas projeção." },
          { id: "obliqua", label: "Linha oblíqua externa", path: null,
            text: "Faixa radiopaca que se estende diagonalmente sobre a região dos molares, correspondente à crista óssea na face externa da mandíbula." },
          { id: "milo", label: "Linha milo-hióidea", path: null,
            text: "Faixa radiopaca mais baixa e mais nítida que a linha oblíqua, em geral cruza a região dos ápices dos molares. Pode ser confundida com limite de lesão." },
          { id: "fossa_sub", label: "Fossa submandibular", path: null,
            text: "Região de trabeculado mais frouxo e menor densidade abaixo da linha milo-hióidea, que pode parecer uma rarefação." }
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

      { id: "lesao", stage: 2, title: "Radiolucência periapical circunscrita", real: false, status: "demo",
        src: "assets/dente-lesao.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: radiolucência periapical arredondada e bem delimitada, com perda da lâmina dura apical",
        diagnoses: ["apc", "pac"],
        regions: [
          { id: "lesao", label: "Área radiolúcida periapical", path: G.LESAO,
            text: "Área escura ao redor do ápice, associada à perda óssea de origem inflamatória. Radiograficamente, lesões periapicais diferentes podem ter aspecto parecido, então a correlação clínica é indispensável. A perda mineral precisa ser suficiente para aparecer: nas fases iniciais a radiografia pode estar normal ou apenas com leve espessamento do ligamento." },
          { id: "ldend", label: "Lâmina dura (interrompida no ápice)", path: G.LDEND,
            text: "Perceba onde a lâmina dura deixa de ser visualizada: na região periapical afetada, a linha radiopaca perde a continuidade." }
        ] },
      { id: "calcificacao", stage: 2, title: "Calcificação pulpar", real: false, status: "demo",
        src: "assets/dente-calcificacao.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: obliteração da câmara e do canal, restando fino traço apical",
        nota: "Achado fora do fluxograma da Etapa 3: serve para reconhecer a variação, não para diagnosticar.",
        regions: [
          { id: "calc", label: "Câmara e canal obliterados", path: G.CALC,
            text: "Redução parcial ou total da luz da câmara e do canal por deposição de tecido mineralizado. A câmara deixa de ser visível e o canal fica fino ou invisível. Pode ocorrer com a idade, após trauma ou irritação crônica e, isoladamente, não indica doença pulpar nem define diagnóstico." }
        ] },
      { id: "reabsint", stage: 2, title: "Reabsorção interna", real: false, status: "demo",
        src: "assets/dente-reabsint.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: ampliação arredondada, em balão, do canal radicular",
        nota: "Achado fora do fluxograma da Etapa 3: reconhecer e diferenciar da reabsorção externa.",
        regions: [
          { id: "rint", label: "Ampliação do canal em forma de balão", path: G.RINT,
            text: "Área radiolúcida arredondada ou oval contínua com o canal, que o amplia de forma simétrica. A imagem permanece centrada no canal quando a angulação do feixe muda, o que a diferencia da reabsorção externa." }
        ] },
      { id: "reabsext", stage: 2, title: "Reabsorção externa", real: false, status: "demo",
        src: "assets/dente-reabsext.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: perda do contorno radicular na região apical e lateral",
        nota: "Achado fora do fluxograma da Etapa 3: reconhecer e diferenciar da reabsorção interna.",
        regions: [
          { id: "rext", label: "Perda do contorno radicular", path: G.REXT,
            text: "Perda de substância na superfície externa da raiz, com contorno irregular ou ‘em mordida’, que pode atingir a região apical ou lateral. O canal costuma manter seu trajeto. A imagem se desloca em relação ao canal quando a angulação muda." }
        ] },
      { id: "difusa", stage: 2, title: "Radiolucência periapical difusa", real: false, status: "demo",
        src: "assets/dente-difusa.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: área radiolúcida periapical de limites mal definidos", diagnoses: ["aaa", "paa"],
        regions: [
          { id: "dif", label: "Radiolucência de limites imprecisos", path: G.DIFUSA,
            text: "Área escura periapical sem limite nítido, que se funde gradualmente ao osso vizinho. Em quadros agudos a radiografia pode estar normal ou com leve espessamento do ligamento, pois a perda mineral ainda é insuficiente para aparecer. A ausência de imagem não exclui doença periapical." }
        ] },
      { id: "fratura", stage: 2, title: "Fratura radicular", real: false, status: "demo",
        src: "assets/dente-fratura.svg", viewBox: "0 0 520 390",
        caption: "Ilustração esquemática: linha radiolúcida oblíqua atravessando a raiz",
        nota: "Achado fora do fluxograma da Etapa 3 (escopo a confirmar com os especialistas).",
        regions: [
          { id: "frat", label: "Linha de fratura", path: G.FRATURA,
            text: "Linha radiolúcida fina que atravessa a raiz, em geral nítida nas fraturas horizontais e oblíquas quando o feixe incide paralelo ao plano da fratura. Fraturas verticais nem sempre são visíveis; pode haver apenas alargamento ligamentar localizado ou lesão lateral." }
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
