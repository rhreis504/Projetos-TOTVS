# Adaptive One

Adaptive One é uma aplicação frontend enterprise para governança inteligente de projetos de implantação. A experiência é segmentada por perfil de acesso e preparada para evoluir com Portfólio, AGF, Cockpit Executivo, Status Report, Riscos, Pendências, Gaps, Times, Indicadores, ORBIT e Configurações.

## Identidade visual

A implementação consultou a pasta `System Prompting/`, especialmente o arquivo `Diretrizes de UX UI.md`. Essa pasta deve continuar sendo a referência obrigatória para qualquer decisão visual futura: cores, cards, espaçamentos, sidebar, header, botões, tipografia e composição das telas.

## Gate 3 operacional vinculado a projeto

O Gate 3 agora é tratado como módulo operacional do projeto, e não como tela estática isolada. A navegação correta passa por:

```text
Cliente → Projeto → Time do Projeto → Jornada AGF → Gate 3 → Execução Controlada
```

Com isso, riscos, pendências, gaps, atividades, decisões, issues, mudanças, entregáveis, dependências, atas, status semanal e planos de ação são filtrados por `projectId`. A rota legada `/agf/gate/3` permanece disponível, mas orienta o usuário a selecionar um projeto antes de abrir o módulo.

## Rotas principais

- `/login`
- `/home`
- `/portfolio`
- `/projetos/:projectId`
- `/projetos/:projectId/agf`
- `/projetos/:projectId/agf/gate/3`
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

## Dados mockados

A estrutura inicial do Gate 3 usa dados mockados em `src/data/` para simular:

- Clientes (`mockClients.js`)
- Projetos (`mockProjects.js`)
- Time do projeto (`mockProjectTeam.js`)
- Frentes do projeto (`mockProjectWorkstreams.js`)
- Atividades, pendências, riscos, gaps, mudanças, decisões, issues, atas, status semanal, entregáveis, dependências e planos de ação do Gate 3

O projeto obrigatório `PRJ-001` representa a implantação RH Rossi, vinculada ao cliente Rossi Supermercados, e carrega dados operacionais suficientes para demonstrar alertas visuais, indicadores executivos, abas operacionais e cálculo simulado de saúde.

## Saúde e status do Gate 3

Os utilitários `src/utils/gate3Health.js` e `src/utils/gate3Status.js` calculam, de forma simulada, a saúde do projeto e o status do Gate 3. Dependências bloqueadas, issues críticas, riscos críticos, pendências vencidas, decisões vencidas, gaps sem decisão, mudanças em análise e entregáveis atrasados impactam a classificação exibida na tela.

## Backend e integrações futuras

Não há backend, banco de dados, Supabase, autenticação real, CRUD persistente ou upload real nesta etapa. A estrutura foi organizada para permitir futura integração, mantendo dados mockados e componentes modulares.

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
src/components/              # Componentes reutilizáveis de layout, login, cards, AGF, Gate 3 e UI
src/config/                  # Configurações de app, menu, perfis e conteúdo da Home
src/data/                    # Dados mockados de projetos, Gate 3, riscos, pendências, indicadores e gates
src/pages/                   # Páginas principais, detalhe de projeto e páginas AGF
src/styles/                  # Entrada Tailwind e tema base
src/utils/                   # Helpers de autenticação, rotas, navegação, saúde e status do Gate 3
```

## Perfis disponíveis

- `cliente` — Você está acessando a visão do cliente.
- `totvs` — Você está acessando a visão TOTVS.
- `parceiro` — Você está acessando a visão do parceiro.

## Autenticação

A autenticação ainda é simulada com `localStorage`, usando a chave `accessProfile`. Ao conectar, o perfil selecionado é salvo localmente. Ao sair, o perfil é removido e a aplicação retorna para `/login`.
