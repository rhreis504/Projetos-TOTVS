# Implantação Supabase - Cockpit Rossi/TOTVS

## 1. Arquivos criados

- `supabase/migrations/20260502_000001_initial_schema.sql`
- `supabase/migrations/20260504_000002_project_sync_and_tap.sql`
- `supabase/migrations/20260505_000003_api_access_and_rpc.sql`
- `scripts/import_spreadsheets_to_supabase.mjs`
- `.env.supabase.example`
- `supabase/setup/supabase-runtime.js`
- `supabase/setup/supabase-configurador.html`

## 2. Ordem correta para executar no Supabase SQL Editor

Execute no SQL Editor do novo projeto Supabase, nesta ordem:

1. `supabase/migrations/20260502_000001_initial_schema.sql`
2. `supabase/migrations/20260504_000002_project_sync_and_tap.sql`
3. `supabase/migrations/20260505_000003_api_access_and_rpc.sql`

Essas migrations criam as tabelas `projects`, `spreadsheet_sources`, `issues`, `risks`, `gaps`, `activities`, `import_jobs`, `source_rows`, `tap_entries`, além de RLS, grants e policies.

## 3. Variáveis de ambiente

Copie `.env.supabase.example` para `.env.local` e preencha:

```bash
cp .env.supabase.example .env.local
```

Nunca versione chaves reais de `service_role`/`secret`.

## 4. Importação inicial

Depois de preencher `.env.local`, rode no terminal:

```bash
node scripts/import_spreadsheets_to_supabase.mjs
```

> `node scripts/import_spreadsheets_to_supabase.mjs` não é SQL. Rode no terminal, não no SQL Editor.

## 5. Teste REST

```bash
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=id,code,name&limit=1" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Authorization: Bearer $SUPABASE_SECRET_KEY"

curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/source_rows?select=id&limit=1" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Authorization: Bearer $SUPABASE_SECRET_KEY"
```

Se o endpoint `source_rows` falhar, geralmente faltou executar a migration `20260504_000002_project_sync_and_tap.sql`.

## 6. Configuração no front-end

No menu **Configurações**, preencha a seção **Supabase**. Ela salva a configuração no `localStorage` na chave `totvs_cockpit_config`, dentro do objeto `supabase`, com os campos `url`, `apiUrl`, `projectRef`, `schema`, `projectsTable`, `tapTable`, `publishableKey`, `anonKey`, `secret`, `serviceRole`, `currentKey` e `previousKey`.

Use o botão **Testar Conexão Supabase** para validar o endpoint REST `projects?select=id,code,name&limit=1` com os headers `apikey` e `Authorization: Bearer`.
