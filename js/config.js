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
  versao: "3.0-dev",
  // true: as etapas liberam em sequência (1 -> 2 -> 3). false: tudo aberto.
  trilhaLinear: true,
  // true: mostra selos "demonstrativo" / "em validação". Colocar false antes de usar com participantes.
  modoDesenvolvimento: true,
  supabaseUrl: "",
  supabaseKey: "",
  // Futuro: endereço da função segura que chama o modelo de IA.
  tutorEndpoint: ""
};
