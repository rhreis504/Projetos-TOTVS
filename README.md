# Adaptive One

Adaptive One é uma aplicação frontend enterprise para governança inteligente de projetos de implantação. A experiência é segmentada por perfil de acesso e preparada para evoluir com Portfólio, AGF, Cockpit Executivo, Status Report, Riscos, Pendências, Gaps, Times, Indicadores, ORBIT e Configurações.

## Identidade visual

A refatoração consultou a pasta `System Prompting/`, especialmente o arquivo `Diretrizes de UX UI.md`. Essa pasta deve continuar sendo a referência obrigatória para qualquer decisão visual futura: cores, cards, espaçamentos, sidebar, header, botões, tipografia e composição das telas.

## Instalação

```bash
npm install
```

## Rodar localmente

```bash
npm run dev
```

## Build de produção

```bash
npm run build
```

## Preview do build

```bash
npm run preview
```

## Estrutura de pastas

```text
assets/images/               # Wallpaper original utilizado pela aplicação
src/app/                     # App e roteamento frontend
src/components/              # Componentes reutilizáveis de layout, login, cards, AGF e UI
src/config/                  # Configurações de app, menu, perfis e conteúdo da Home
src/data/                    # Dados mockados de projetos, riscos, pendências, indicadores e gates
src/pages/                   # Páginas principais e páginas AGF
src/styles/                  # Entrada Tailwind e tema base
src/utils/                   # Helpers de autenticação, rotas e navegação
```

## Perfis disponíveis

- `cliente` — Você está acessando a visão do cliente.
- `totvs` — Você está acessando a visão TOTVS.
- `parceiro` — Você está acessando a visão do parceiro.

## Rotas principais

- `/login`
- `/home`
- `/portfolio`
- `/cockpit`
- `/status-report`
- `/riscos`
- `/pendencias`
- `/gaps`
- `/times`
- `/indicadores`
- `/orbit`
- `/configuracoes`
- `/agf`
- `/agf/arvore`
- `/agf/gate/0` até `/agf/gate/5`

A rota `/` redireciona para `/login` quando não há perfil salvo e para `/home` quando há perfil salvo.

## Autenticação

A autenticação ainda é simulada com `localStorage`, usando a chave `accessProfile`. Ao conectar, o perfil selecionado é salvo localmente. Ao sair, o perfil é removido e a aplicação retorna para `/login`.

## Backend e Supabase

Não há backend, banco de dados ou Supabase nesta etapa. A estrutura foi organizada para permitir futura integração, mantendo dados mockados e configuração modular.
