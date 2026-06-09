# Controle de Estoque de Ativos

Um painel de inventário em React + Vite para gerenciar entregas, devoluções, transferências e descarte de ativos de TI.

## Visão Geral

O app oferece:
- Registro de entregas de equipamentos a colaboradores.
- Controle de estoque de itens e reposições.
- Histórico de ações (entrega, devolução, transferência, descarte).
- Painel administrativo para gerenciar setores, categorias e ativos descartados.
- Autenticação simples por token via `VITE_ACCESS_TOKEN`.
- Integração opcional com Supabase para sincronização de estado.

## Recursos Principais

- **Guias de estoque**: adicionar itens, ajustar quantidades e listar inventário.
- **Gestão de entregas**: registrar ativos entregues, devolver equipamentos e transferir itens entre setores.
- **Módulo de descartes**: registrar ativos descartados do Painel Admin.
- **Histórico completo**: acompanhar ações passadas e auditoria do inventário.
- **Administração**: cadastrar/remover setores e categorias.

## Requisitos

- Node.js 18+ recomendado
- npm ou pnpm

## Instalação

No diretório do projeto:

```bash
npm install
```

## Execução local

```bash
npm run dev
```

O app ficará disponível em:

```bash
http://localhost:3000
```

Para testar a build:

```bash
npm run build
npm run preview
```

## Variáveis de Ambiente

Crie um arquivo `.env` local na raiz do projeto com:

```env
VITE_ACCESS_TOKEN=seu_token_de_acesso
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_public_key_do_supabase
```

> Importante: não envie o arquivo `.env` para o GitHub. Ele está protegido pelo `.gitignore`.

## Integração com Supabase

O app usa Supabase para carregar e salvar o estado do inventário quando as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem configuradas.

Crie a tabela `inventory_state` com o SQL abaixo:

```sql
create table inventory_state (
  id text primary key,
  payload jsonb,
  updated_at timestamptz default now()
);
```

## Build e Deploy

Build do projeto:

```bash
npm run build
```

Público:

- Diretório de publicação: `dist`
- Comando de build: `npm run build`

### Deploy no Supabase Static Site

1. Crie um projeto no Supabase.
2. Adicione um Static Site.
3. Conecte o repositório GitHub.
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Adicione as variáveis de ambiente necessárias.

## Estrutura importante

- `src/App.tsx` — lógica principal do app.
- `src/lib/supabase.ts` — cliente Supabase.
- `src/lib/supabaseState.ts` — carregamento/salvamento opcional do estado.
- `src/components/AdminPanel.tsx` — painel de administração.
- `src/components/DiscardsList.tsx` — lista de ativos descartados.

## Observações

- O token de acesso é apenas um meio simples de proteção de tela de login.
- Use a chave anon/public do Supabase no cliente.
- Mantenha `VITE_SUPABASE_ANON_KEY` como chave pública de cliente, e não um service role key.

