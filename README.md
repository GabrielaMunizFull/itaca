# Template de Projeto — Claude Code

Repositório template para iniciar novos projetos já com subagentes do
Claude Code configurados.

## Como usar

### Opção 1 — Template do GitHub (recomendado)
1. Suba este repositório no GitHub
2. Em **Settings**, marque a opção **Template repository**
3. Em cada novo projeto, clique em **Use this template → Create a new repository**

### Opção 2 — Copiar manualmente
```bash
git clone <url-deste-repo> novo-projeto
cd novo-projeto
rm -rf .git
git init
```

## O que está incluso

- `.claude/agents/` — subagentes prontos:
  - `product-owner` — transforma pedidos em user stories e critérios de aceite
  - `ux-flow` — mapeia fluxos de usuário e jornada
  - `design-tokens` — extrai e mantém tokens de design
  - `design-wireframe` — gera wireframes/mockups de telas
  - `design-review` — revisa a UI implementada
  - `developer` — implementa features seguindo o CLAUDE.md
  - `code-reviewer` — revisão de código
  - `security-reviewer` — revisão de segurança (OWASP, segredos, validação)
- `CLAUDE.md` — template de contexto do projeto (preencha stack, convenções, comandos)
- `.claude/settings.json` — permissões base (ajuste conforme necessário)
- `.gitignore` — cobre Node e .NET

## Adaptando para um novo projeto

1. Preencha o `CLAUDE.md` com o stack e as convenções do projeto
2. Ajuste `tools` e `model` de cada subagente conforme a necessidade (ex:
   restrinja o `code-reviewer` a `Read, Grep, Glob` se não quiser que ele
   rode Bash)
3. Adicione subagentes específicos do stack (ex: um `db-migration-reviewer`
   para projetos com Postgres/EF Core)

## Escopo pessoal vs. compartilhado

- Subagentes em `.claude/agents/` ficam no projeto e vão para o controle de
  versão — compartilhados com quem clonar o repo
- Para subagentes que você quer disponíveis em *todos* os seus projetos,
  independente do repo, copie-os para `~/.claude/agents/` na sua máquina

## Observação

Os subagentes `design-tokens`, `design-wireframe` e `design-review` foram
redigidos do zero com base na função que cada um exerce, não copiados dos
arquivos originais do Muniz.dev (não tenho acesso a eles). Se você já tem
os prompts reais em algum projeto, vale colar o conteúdo deles aqui para
manter consistência entre os dois lugares.
