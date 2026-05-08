# Diretrizes de UX/UI — Adaptive One

Use este documento como **system prompt de referência** em toda nova interação de geração de código para manter consistência visual, reduzir retrabalho de refatoração e garantir que qualquer nova tela, componente ou fluxo se encaixe no projeto Adaptive One.

## 1. Contexto do produto

O Adaptive One é uma plataforma de **governança inteligente para projetos de implantação**, com experiências segmentadas para três perfis de acesso:

- **Cliente**: acompanha projetos, cronogramas, documentos, treinamentos, aprovações e pendências.
- **TOTVS**: gerencia portfólio, cockpit executivo, riscos, pendências, governança, times e indicadores.
- **Parceiro**: acompanha projetos vinculados, entregáveis, agendas, documentos, status da frente e comunicação.

Sempre preserve a percepção de produto corporativo, confiável, claro e orientado à tomada de decisão.

## 2. Princípios de experiência

1. **Clareza operacional**
   - Cada tela deve deixar evidente o objetivo principal do usuário.
   - Priorize rótulos diretos, hierarquia visual clara e ações fáceis de localizar.

2. **Consistência entre perfis**
   - Cliente, TOTVS e Parceiro podem ter conteúdos diferentes, mas devem compartilhar a mesma estrutura visual, navegação, padrões de card, cabeçalho, sidebar e estados de interação.

3. **Governança e confiança**
   - Use linguagem profissional, objetiva e segura.
   - Evite elementos visuais excessivamente lúdicos ou desalinhados com um sistema corporativo.

4. **Redução de esforço cognitivo**
   - Agrupe informações relacionadas.
   - Prefira componentes reutilizáveis em vez de layouts únicos para cada caso.
   - Mostre estados vazios, erros, carregamento e sucesso quando aplicável.

5. **Responsividade como padrão**
   - Toda interface deve funcionar bem em desktop, tablet e mobile.
   - Em mobile, priorize menus colapsáveis, grids de uma coluna e botões com área de toque confortável.

## 3. Identidade visual

### Paleta principal

- **Azul primário**: `blue-600` / `#2563eb`
  - Usar em ações primárias, links, ícones ativos, badges principais e estados selecionados.
- **Azul escuro / base institucional**: `slate-900` / `#0f172a`
  - Usar em headers de destaque, banners, fundos escuros e áreas institucionais.
- **Fundo claro**: `slate-50` / `#f8fafc`
  - Usar como base das páginas internas.
- **Superfície**: `white` / `#ffffff`
  - Usar em cards, formulários, sidebars e containers principais.
- **Texto principal**: `slate-800` ou `slate-900`
- **Texto secundário**: `slate-500` ou `slate-600`
- **Bordas**: `slate-100`, `slate-200` ou `slate-300`

### Cores semânticas

- **Sucesso / governança positiva**: `emerald-600`, `emerald-100`
- **Atenção / pendências**: `amber-600`, `amber-100`
- **Risco / erro**: `red-600`, `red-100`, `red-50`
- **Informação**: `sky-600`, `blue-100`
- **Indicadores / análise**: `indigo-600`, `violet-600`, `fuchsia-600`

Use cores semânticas com moderação e sempre com contraste adequado.

## 4. Tipografia

- Manter tipografia padrão do Tailwind/sistema, com aparência limpa e corporativa.
- Títulos de página: `text-3xl` a `text-4xl`, `font-bold`.
- Títulos de seção: `text-lg` a `text-xl`, `font-bold` ou `font-semibold`.
- Texto de apoio: `text-sm`, `text-slate-500` ou `text-slate-600`.
- Labels de formulário: `text-sm`, `font-medium`, `text-slate-700`.
- Evite múltiplas famílias tipográficas ou estilos decorativos.

## 5. Layout e espaçamento

- Usar containers com largura máxima consistente, preferencialmente `max-w-7xl w-full mx-auto` para áreas internas.
- Espaçamento padrão de página: `p-6 sm:p-8`.
- Gaps de grids e blocos: `gap-4`, `gap-6` ou `gap-8`, conforme densidade.
- Cards devem usar bordas arredondadas (`rounded-xl` ou `rounded-2xl`), borda sutil e sombra leve.
- Evitar telas densas demais; priorizar respiro visual e agrupamento por contexto.

## 6. Componentes padrão

### Cards

- Base recomendada: `bg-white p-6 rounded-xl shadow-sm border border-slate-100`.
- Hover: `hover:shadow-md transition-shadow`.
- Ícones em containers quadrados arredondados (`w-12 h-12 rounded-lg`) com fundo claro semântico.
- A ação secundária pode aparecer no hover, desde que não esconda informações críticas.

### Botões

- Primário: `bg-blue-600 hover:bg-blue-700 text-white`.
- Desabilitado: `bg-slate-300 cursor-not-allowed`.
- Perigo/logout: texto `text-slate-600` com hover `text-red-600 hover:bg-red-50`.
- Sempre aplicar `transition-colors` ou `transition-all duration-200`.

### Formulários

- Inputs com borda `border-slate-300`, raio `rounded-lg`, texto `text-sm` e foco `focus:ring-blue-500 focus:border-blue-500`.
- Labels sempre visíveis.
- Mensagens de erro em bloco claro: `bg-red-50 text-red-600 border border-red-100`.
- Evite placeholders como única forma de instrução.

### Sidebar

- Largura padrão: `w-64`.
- Fundo branco, borda direita `border-r border-slate-200`.
- Item ativo: `bg-blue-50 text-blue-700 font-medium`.
- Item inativo: `text-slate-600 hover:bg-slate-50 hover:text-slate-900`.
- Em mobile, usar overlay escuro `bg-slate-900/50` e transição lateral.

### Header

- Altura padrão: `h-16`.
- Fundo branco, borda inferior `border-b border-slate-200`.
- Deve conter ação de menu mobile, identificação do contexto e área de usuário/logout.

### Banners de destaque

- Usar fundo `bg-slate-900`, texto branco, bordas `rounded-2xl` e sombras leves.
- Pode conter efeitos sutis de blur em azul/índigo para reforçar identidade, sem prejudicar leitura.

## 7. Ícones

- Usar `lucide-react` como biblioteca padrão de ícones.
- Tamanhos recomendados:
  - Ícone de card: `w-6 h-6` dentro de container `w-12 h-12`.
  - Ícone de navegação: `w-5 h-5`.
  - Ícone de marca/header: `w-6 h-6` a `w-8 h-8`.
- Ícones devem reforçar significado funcional, não apenas decorar.

## 8. Estados de interface

Sempre considerar os seguintes estados quando criar novos fluxos:

- **Carregando**: usar spinner ou skeleton simples com cores `slate` e destaque `blue-600`.
- **Erro**: mensagem objetiva, visual em vermelho suave e ação de recuperação quando possível.
- **Vazio**: explicar o que não existe e sugerir próxima ação.
- **Sucesso**: confirmar a ação sem bloquear o fluxo.
- **Desabilitado**: explicar visualmente que a ação não está disponível.

## 9. Acessibilidade

- Garantir contraste adequado entre texto e fundo.
- Não depender apenas de cor para comunicar status; use texto, ícones ou rótulos.
- Botões clicáveis devem ter área confortável e estado de foco quando aplicável.
- Inputs devem ter `label` associado ou claramente próximo.
- Textos de link e botão devem ser descritivos.

## 10. Responsividade

- Mobile primeiro quando possível.
- Grids recomendados:
  - Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
  - Conteúdo simples: uma coluna em mobile e duas colunas em telas maiores.
- Sidebar deve ser fixa no desktop e colapsável no mobile.
- Evite larguras fixas que causem overflow horizontal.

## 11. Escrita e microcopy

- Idioma padrão: português do Brasil.
- Tom: profissional, claro e prestativo.
- Preferir frases curtas.
- Exemplos de boas chamadas:
  - “Acesse sua jornada de implantação”
  - “Módulos em destaque”
  - “Governança inteligente para acompanhar projetos, entregas, riscos e evolução operacional.”
- Evitar jargões técnicos sem necessidade.

## 12. Regras para geração de código

Ao gerar ou alterar código neste projeto:

1. Reutilize componentes e padrões existentes antes de criar novos.
2. Preserve a estrutura de perfis (`cliente`, `totvs`, `parceiro`) quando a funcionalidade depender do tipo de usuário.
3. Mantenha Tailwind CSS como principal mecanismo de estilo.
4. Use classes utilitárias consistentes com a paleta descrita neste documento.
5. Não introduza bibliotecas visuais novas sem necessidade clara.
6. Não quebre o layout responsivo existente.
7. Não altere a identidade Adaptive One sem justificativa.
8. Inclua estados de erro, vazio e carregamento quando criar fluxos de dados ou formulários.
9. Prefira nomes de componentes, variáveis e funções claros e alinhados ao domínio.
10. Antes de finalizar, revise consistência visual, responsividade, acessibilidade e microcopy.

## 13. Prompt reutilizável para novas interações

Copie e cole o trecho abaixo no início de novas solicitações de código:

```text
Considere as Diretrizes de UX/UI do Adaptive One como regra de design para esta tarefa.

Objetivo:
- Gerar código coeso com o projeto existente.
- Preservar a identidade corporativa, a paleta em azul/slate, a estrutura responsiva e os padrões de componentes.
- Reduzir retrabalho visual e manter consistência entre os perfis Cliente, TOTVS e Parceiro.

Regras obrigatórias:
- Use Tailwind CSS como base visual.
- Use lucide-react para ícones quando necessário.
- Mantenha cards com fundo branco, borda sutil, rounded-xl/rounded-2xl e sombra leve.
- Use azul (`blue-600`) para ações primárias e slate para estrutura/base.
- Garanta responsividade mobile, tablet e desktop.
- Inclua estados de carregamento, erro, vazio e sucesso quando aplicável.
- Escreva textos em português do Brasil, com tom corporativo e claro.
- Não introduza novas bibliotecas visuais sem necessidade.
- Ao criar novas telas, respeite sidebar, header, grid de cards e espaçamentos já usados no projeto.

Agora implemente a solicitação a seguir mantendo essas diretrizes.
```
