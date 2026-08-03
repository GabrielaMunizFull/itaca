# CLAUDE.md

> Contexto do projeto para o Claude Code. Preencha cada seção ao começar um
> novo projeto a partir deste template — quanto mais específico, menos o
> Claude precisa perguntar ou adivinhar.

## Sobre o projeto
- Nome: Ãtaca
- Objetivo: app mobile satírico de "navegação/sobrevivência" para heróis em jornadas épicas intermináveis, inspirado na Odisseia de Homero. Ver `README.md` (handoff de design) e `Itaca App.dc.html` (protótipo hifi de referência) na raiz do repo.
- Público-alvo: usuários de apps mobile que curtem humor/sátira; protótipo cobre onboarding, 5 telas principais (Home, Alerta de Sereia, Scanner de Ciclope, Status para Penélope, Central de Ajuda Divina), Configurações e splash animado.

## Stack técnica
- Frontend: React Native com Expo, TypeScript, React Navigation (bottom tabs para as 5 telas principais), Zustand para estado global (substitui o `this.state` único do protótipo)
- Backend: nenhum ainda — protótipo é local-only; toda "API" é mock hardcoded (criaturas, posts, contatos, respostas de SOS)
- Banco de dados: nenhum — persistência local via `AsyncStorage` (substitui `localStorage`/`itaca-mvp-state` do protótipo). Dados sensíveis, se algum dia existirem, devem usar `expo-secure-store`
- Hospedagem / Deploy: EAS Build/Submit (a definir/configurar quando o projeto for criado)
- Outras ferramentas: fontes Google Fonts `Cinzel` e `Inter` via `expo-font`/`@expo-google-fonts`

## Convenções de código
- Padrão de nomenclatura: PascalCase para componentes/telas (ex: `HomeScreen.tsx`), camelCase para funções/hooks/variáveis
- Estrutura de pastas sugerida: `src/screens`, `src/components`, `src/store` (Zustand), `src/theme` (tokens: cores, tipografia, espaçamento), `src/navigation`
- Padrão de commits: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Estratégia de testes: a definir quando o projeto for criado (recomendado: Jest + React Native Testing Library)

## Comandos úteis
Todos os comandos abaixo rodam de dentro de `mobile/` (`cd mobile` primeiro):
- `npx expo start` — sobe o ambiente local (Metro bundler)
- `npx expo start --android` / `--ios` / `--web` — sobe direto na plataforma escolhida
- `npx tsc --noEmit` — checagem de tipos sem gerar build
- `npm run build` — build de produção (via EAS quando configurado)
- `npm run test` — roda a suíte de testes

## Regras e restrições
- Nunca faça commit direto na `main`; sempre abra PR
- Nunca exponha chaves de API, tokens ou segredos em código ou logs
- Nunca commitar as pastas `ios/`/`android/` geradas por `expo prebuild`, a menos que um build nativo customizado exija
- `Itaca App.dc.html` e `README.md` são referência de design em **alta fidelidade** (cores, tipografia, espaçamento e interações já definidos) — recriar fielmente em React Native, não redesenhar do zero

## Subagentes disponíveis
Definidos em `.claude/agents/`:

**Produto & UX**
- `product-owner` — transforma pedidos em user stories e critérios de aceite
- `ux-flow` — mapeia fluxos de usuário e jornada antes da implementação

**Design**
- `design-tokens` — extrai e mantém os tokens de design (cores, tipografia, espaçamento)
- `design-wireframe` — gera wireframes/mockups de telas a partir de requisitos
- `design-review` — revisa a UI implementada contra os tokens e acessibilidade

**Desenvolvimento & qualidade**
- `developer` — implementa features e correções seguindo o CLAUDE.md
- `code-reviewer` — revisão de código focada em qualidade e boas práticas
- `security-reviewer` — revisão de segurança (OWASP, segredos, validação de input)
