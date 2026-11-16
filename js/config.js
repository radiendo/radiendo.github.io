/* ============================================================
   RadiEndo · CONFIGURAÇÃO
   Deixe supabaseUrl e supabaseKey vazios para funcionar só
   localmente (os registros ficam no navegador e podem ser
   exportados na página #pesquisador). Quando o projeto no Supabase
   estiver criado (ver supabase/schema.sql e LEIA-ME), preencha:
     supabaseUrl: "https://SEU-PROJETO.supabase.co"
     supabaseKey: "SUA-CHAVE-ANON-PUBLICA"   (nunca a service_role!)
   ============================================================ */
window.RADIENDO_CONFIG = {
  versao: "4.0-dev",
  // true: as etapas liberam em sequência (1 -> 2 -> 3). false: tudo aberto.
  trilhaLinear: true,
  // Fração das regiões que o aluno precisa explorar para liberar a próxima etapa (0 a 1).
  limiteConclusao: 0.7,
  // true: mostra selos "demonstrativo" / "em validação". Colocar false antes de usar com participantes.
  modoDesenvolvimento: true,
  supabaseUrl: "",
  supabaseKey: "",
  // Tutora: busca semântica no navegador (sem custo, sem chave de API).
  // Ajuste os limiares depois do teste de perguntas (admin.html > Testar busca).
  busca: {
    usarSemantica: true,      // false = só busca por palavras
    semMin: 0.80,             // similaridade mínima para exibir um trecho
    semAlta: 0.86,            // a partir daqui: "relevância alta"
    maxResultados: 5
  }
};
