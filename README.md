# Controle de Estoque de Ativos

Este projeto é um aplicativo React + Vite para controle de ativos e inventário.

## Deploy no Supabase

1. Execute localmente:

```bash
npm install
npm run build
```

2. No Supabase, crie um projeto e adicione um Static Site.
3. Conecte o repositório GitHub ou faça upload dos arquivos.
4. Use estas configurações:

- Build command: `npm run build`
- Publish directory: `dist`

5. Adicione variáveis de ambiente no Supabase se precisar de autenticação ou Supabase:

- `VITE_ACCESS_TOKEN` (opcional, valor usado no app)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

7. Para usar sincronização de dados com Supabase, crie uma tabela chamada `inventory_state` e use este SQL:

```sql
create table inventory_state (
  id text primary key,
  payload jsonb,
  updated_at timestamptz default now()
);
```

8. Clique em `Deploy`.

9. O app carregará o estado remoto se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem definidos.

## Configuração local

Crie um arquivo `.env` na raiz com:

```env
VITE_ACCESS_TOKEN=IventarioTI2026X
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Uso do Supabase

O projeto já inclui um cliente Supabase em `src/lib/supabase.ts`.
Importe-o para usar banco de dados ou autenticação em outras partes do app.

