-- RadiEndo · esquema do banco (Supabase / PostgreSQL)
-- Execute no painel do Supabase: SQL Editor > New query > colar > Run.
-- Princípio: o site (chave "anon") só consegue INSERIR eventos.
-- Ninguém de fora lê os dados; você lê pelo painel (Table Editor)
-- ou com a chave service_role (nunca colocar no site).

create table if not exists public.events (
  id uuid primary key,
  received_at timestamptz not null default now(),
  client_ts timestamptz,
  participant_code text not null,
  session_id text,
  type text not null,
  page text,
  payload jsonb not null default '{}'::jsonb,
  app_version text
);

alter table public.events enable row level security;

-- Anônimo pode apenas inserir; não há política de select/update/delete.
create policy "site pode inserir eventos"
  on public.events for insert to anon
  with check (char_length(participant_code) between 3 and 20);

create index if not exists events_code_idx on public.events (participant_code, client_ts);
