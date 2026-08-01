# CLAUDE.md

> Contexto do projeto para o Claude Code. Preencha cada seção ao começar um
> novo projeto a partir deste template — quanto mais específico, menos o
> Claude precisa perguntar ou adivinhar.

## Sobre o projeto
- Nome:
- Objetivo:
- Público-alvo:

## Stack técnica
- Frontend:
- Backend:
- Banco de dados:
- Hospedagem / Deploy:
- Outras ferramentas:

## Convenções de código
- Padrão de nomenclatura:
- Estrutura de pastas:
- Padrão de commits (ex: Conventional Commits):
- Estratégia de testes:

## Comandos úteis
- `npm run dev` — sobe o ambiente local
- `npm run build` — build de produção
- `npm run test` — roda a suíte de testes

## Regras e restrições
- Nunca faça commit direto na `main`; sempre abra PR
- Nunca exponha chaves de API, tokens ou segredos em código ou logs
- (adicione restrições específicas do projeto aqui)

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
