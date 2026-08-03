# Handoff: Ãtaca — App de Navegação Épica (satírico)

## Overview
Ãtaca é um app mobile fictício de "navegação/sobrevivência" para heróis em jornadas intermináveis, inspirado na Odisseia de Homero com tom satírico. O protótipo cobre onboarding, 5 telas principais (Home, Alerta de Sereia, Scanner de Ciclope, Status para Penélope, Central de Ajuda Divina), tela de Configurações, splash screen animado e persistência local de estado.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — um protótipo React (via Design Component runtime interno) que mostra visual e comportamento pretendidos, não código de produção para copiar diretamente. A tarefa é **recriar este design HTML no ambiente real do projeto** (React Native, Flutter, SwiftUI, Android nativo, etc.) usando os padrões e bibliotecas já estabelecidos no codebase-alvo — ou, se não houver ambiente ainda, escolher o framework mais adequado (recomendado: React Native ou Flutter, dado que é mobile-first com navegação por abas) e implementar lá.

## Fidelity
**Alta fidelidade (hifi)**: cores, tipografia, espaçamento e interações finais definidos. O desenvolvedor deve recriar a UI fielmente, usando as bibliotecas/design tokens já existentes no codebase-alvo quando disponíveis, ou os valores exatos abaixo caso esteja começando do zero.

## Screens / Views

### 0. Splash Screen
- **Purpose**: abertura do app; mapa se desenha sozinho e depois se rasga ao meio.
- **Layout**: tela cheia (#EFE2C4), conteúdo centralizado (flex column, align-center, justify-center).
- **Componentes**:
  - Ilustração de mapa em SVG (220×220px), traçado com `stroke-dasharray`/`stroke-dashoffset` animando de "desenhando" (1.7s ease) para completo.
  - Após ~1.7s, o mapa se divide em duas metades (`clip-path` polygon irregular tipo rasgo) que se afastam lateralmente com rotação leve (`translateX(±46px) rotate(±7deg)`), ao longo de 3s total.
  - Título "ÃTACA": Cinzel 900, 34px, letter-spacing 6px, cor #2E2418, leve emboss (text-shadow duplo).
  - Subtítulo: Inter 12px, #5B4C36, "navegação para heróis que demoram a chegar".
  - Dica: Inter 11px, #8a7a63, "toque para pular a saga" — tela inteira é clicável para pular.
  - Duração total antes de avançar automaticamente: 3000ms.

### 1. Onboarding (2 passos)
- **Purpose**: criação do herói antes da primeira jornada.
- **Passo 1 — Identidade**:
  - Grid 2×2 de arquétipos (Guerreiro, Arqueiro, Timoneiro, Oráculo): card 12px padding, border-radius 12px, avatar circular 34px com inicial (Cinzel 700 14px); selecionado = fundo #17454F/texto #fff8e8, não selecionado = fundo #E3D3A8/texto #5B4C36.
  - Input "Nome do herói" (placeholder "Odisseu") e "Nome do navio" (placeholder "Argo II"): fundo #fff8e8, borda 1px rgba(46,36,24,.15), radius 10px, padding 11px 13px, fonte Inter 13px.
  - Botão "CONTINUAR": largura 100%, fundo #BF5B33, texto #fff8e8, Cinzel 700 14px, radius 14px, padding 15px.
- **Passo 2 — Permissões**:
  - Dois cards de toggle: "Permitir localização" ("para sabermos o quão perdido você está") e "Permitir notificações" ("os deuses gostam de interromper"). Toggle: track 44×26px radius 20px, on=#6E8F4B/off=#c9bb96, knob 22px branco (#fff8e8) deslizando 2px→20px.
  - Botão "COMEÇAR JORNADA" (mesmo estilo do CONTINUAR) + link texto "voltar".

### 2. Home
- **Purpose**: visão geral da jornada atual — ETA duplo, mapa de rota, próximos desvios.
- **Layout**: padding 20px, scroll vertical, bottom padding 100px (espaço pra nav+FAB).
- **Header**: saudação "BEM-VINDO DE VOLTA," (Inter 11px #8a7a63 letter-spacing 1px) + nome do herói (Cinzel 900 26px #2E2418, letter-spacing 2px, leve emboss). À direita: ícone de sino (notificações, badge vermelho #9C2E1E com contagem) e ícone de engrenagem (abre Configurações), ambos em círculos 36px #E3D3A8.
- **Dropdown de notificações**: card branco (#fff8e8) 230px, radius 12px, shadow, posicionado abaixo do sino; 3 itens de texto 11px separados por borda inferior sutil.
- **Cards ETA duplo** (lado a lado, gap 10px):
  - "TEMPO ESTIMADO": fundo #E3D3A8, valor "3 dias" (20px 700 #17454F), legenda "segundo o oráculo".
  - "TEMPO REAL (HISTÓRICO)": fundo #F3E4C1, borda 1px rgba(191,91,51,.25), valor "9 anos, 11 meses" (20px 700 #8F4023), legenda "baseado em 1 jornada anterior (a sua)".
- **Card de clima**: fundo #E3D3A8, ícone de sol (SVG linha), texto "Aparentemente calmo" / "Poseidon está fingindo não ver você".
- **Card "ROTA ATUAL"**: fundo #fff8e8, radius 16px, contém mapa SVG (230px altura) com rota tracejada laranja (#BF5B33, dasharray 3 2.4) cheia de curvas/desvios, linha reta pontilhada dourada (#B9924A) mostrando a "rota original", pontos de parada, labels "Troia" / "Sereias" / "Ãtaca". Legenda de cores no canto superior direito do card.
- **Lista "PRÓXIMOS DESVIOS"**: 3 cards (#E3D3A8, radius 12px) — Ilha dos Lotófagos, Território dos Ciclopes, Eólia — cada um com título bold + descrição irônica em cinza.
- **Botões**: "INICIAR NAVEGAÇÃO" (primário, #BF5B33) e "Ver histórico de desvios (14)" (outline, #17454F).

### 3. Alerta de Canto de Sereia
- **Purpose**: geofencing de zona de perigo (canto de sereia) com ações de mitigação.
- **Mapa de perigo**: fundo escuro (#123038) dentro de card #3a1712, mesma rota tracejada em dourado semi-transparente, zona de perigo = círculo pulsante vermelho (#9C2E1E, `animation: pulseZone 2.2s` alternando scale 1→1.18 e opacity .55→.25) com label "ZONA DE PERIGO". Badge "RAIO: 2.4 LÉGUAS" no canto superior esquerdo.
- **Banner de aviso**: fundo #F3E4C1, borda esquerda 3px #9C2E1E, texto "Você está a 340m de uma zona de canto irresistível...".
- **Toggles de ação**: "Amarrar-me ao mastro" (recomendado pela Circe) e "Cera nos ouvidos dos remadores" — mesmo padrão visual de toggle do onboarding.
- **Contador "SEREIAS EVITADAS"**: card com número grande + botão "Registrar sereia evitada" (incrementa contador, dispara toast, grava entrada no histórico).
- **Histórico "ZONAS ENFRENTADAS"**: lista das últimas 5 sereias evitadas com timestamp.
- **Aviso legal irônico** no rodapé.

### 4. Scanner de Ciclope
- **Purpose**: simulação de câmera/IA identificando criaturas.
- **Viewfinder**: card escuro (#0c1f24), SVG estilizado de um ciclope simplificado, moldura de foco em cantos (verde #6E8F4B), badge "● GRAVANDO" e "{{confiança}}% confiança". Durante scan, uma barra horizontal verde "varre" verticalmente (`floatBob` 1.1s).
- **Chips de criaturas simuladas** (scroll horizontal): Polifemo, Cila, Caríbdis, Lestrigões, Circe — selecionado = fundo #17454F.
- **Botão "Escanear criatura"**: dispara estado `scanning` por 1.3s, depois popula card de resultado (nome, tipo, badge de ameaça, nota irônica, botão "Fingir ser 'Ninguém'", botão "Compartilhar alerta").
- **Modal de compartilhamento**: overlay escuro + card com preview de "post social" (nome da criatura + hashtags #AindaVivo #ÃtacaApp).
- **Histórico de scans**: até 3 entradas recentes com nome/ameaça/horário.

### 5. Status para Penélope
- **Purpose**: feed social somente-leitura de "provas de vida" automáticas.
- **Aviso**: "Só posts automáticos permitidos — evita promessas que você não vai cumprir."
- **Botão "Enviar sinal de vida agora"**: adiciona novo post no topo do feed com texto fixo irônico.
- **Post fixado de Penélope**: fundo verde-oliva (#dfe9dc), borda esquerda #6E8F4B, itálico.
- **Lista de posts**: cada card (#fff8e8) tem "DIA X · HH:MM", badge "AUTO", texto do post, e 3 reações estilo ícone-fino (âncora, escudo, interrogação) com contador — clicáveis, incrementam.
- Animação de entrada com stagger (~60ms por item).

### 6. Central de Ajuda Divina
- **Purpose**: lista de contatos divinos com status de disponibilidade.
- **Busca** (decorativa no protótipo).
- **Lista de contatos**: avatar circular com inicial + dot de status colorido (verde=online, dourado=away, terracota=busy, vermelho=danger, cinza=blocked/waiting), nome, papel, texto de status irônico. Poseidon tem botão "Silenciar"/"Reativar".
- **Aviso**: consequências de silenciar Poseidon.
- **Botão "SOS AOS DEUSES"**: abre modal com resposta aleatória de uma divindade (6 variações pré-escritas), grava no histórico de invocações.

### 7. Configurações (acessível pelo ícone de engrenagem na Home)
- Editar nome do herói e do navio (inputs + botão salvar).
- Toggle "Modo noturno no mar" (aplica filtro CSS `brightness(.78) saturate(.82) hue-rotate(-8deg)` sobre toda a tela).
- Botão destrutivo "Recomeçar jornada do zero" (confirmação via `window.confirm`, limpa localStorage e reseta todo o estado).

## Interactions & Behavior
- **Navegação por bottom tab bar** (5 ícones: Início, Sereia, Ciclope, Penélope, Divina): troca de aba dispara uma transição temática de "rasgo de papiro" — um shape laranja (#BF5B33) com `clip-path` irregular varre a tela da esquerda pra direita (`animation: wipeTear .52s`), cobrindo a troca de conteúdo (delay de 190ms antes de trocar a tela real).
- **Ícone ativo na tab bar**: cor #BF5B33; inativo: #8a7a63.
- **FAB "salvar progresso"** (canto inferior direito, círculo #17454F, pulso contínuo sutil via `fabPulse`): ao tocar, ícone de âncora desce (`translateY` de -34px para 6px, spring easing `cubic-bezier(.34,1.4,.5,1)`, 0.8s) e um toast aparece por ~2.4–3.2s com mensagem irônica ("Progresso salvo. Pena que sua vida não vem com esse recurso.").
- **Toggles** (mastro, cera, permissões, modo noturno): clique alterna estado local, anima track/knob em 0.2s.
- **Scan de criatura**: estado `scanning` (1.3s) → `scanDone` (mostra card de resultado com fade+scale 0.35s).
- **Onboarding**: 2 passos sequenciais; ao completar, grava `onboarded: true` e nunca mais mostra onboarding (a menos que o usuário "recomece a jornada").
- **Todas as entradas de listas** (posts, contatos, histórico) entram com animação `cardIn` (fade + translateY 8px) com stagger crescente por índice.
- **Modais** (compartilhar, SOS): overlay com fade (`overlayFade` .2s) + conteúdo com spring-in (`modalIn` .28s); clique fora fecha.
- **Splash**: auto-avança após 3000ms ou ao toque.

## State Management
Estado principal (hoje em `this.state` de um componente único; recomenda-se separar por domínio no app real):
- `screen`: aba ativa ('home' | 'siren' | 'cyclops' | 'penelope' | 'divine')
- `onboarded`, `obStep`, `obForm` (name, ship, archetype, loc, notif)
- `heroName`, `shipName`, `archetype`
- `settingsOpen`, `settingsForm`, `darkMode`
- `notifOpen`, `notifSeen`
- `mastTied`, `earplugs` (toggles da tela Sereia)
- `poseidonMuted` (Central Divina)
- `selectedCreature`, `scanning`, `scanDone`, `scanHistory[]` (Ciclope)
- `shareOpen` (modal de compartilhamento)
- `posts[]` (feed Penélope, cada post com `reactions: {anchor, shield, question}`)
- `sirenCount`, `sirenLog[]` (Sereia)
- `sosOpen`, `sosReply`, `sosLog[]` (Central Divina)
- `saving`, `toast`, `toastMsg` (FAB de salvar)
- `navWipe` (transição de tab)

**Persistência**: todo o estado relevante (nome, navio, arquétipo, onboarded, darkMode, posts, scanHistory, sirenCount/log, sosLog, mastTied, poseidonMuted) é salvo em `localStorage` sob a chave `itaca-mvp-state` a cada atualização, e recarregado no mount. Recomenda-se, na implementação real, mover isso para o storage nativo da plataforma (AsyncStorage/Keychain/SharedPreferences) ou backend.

**Dados mockados** (não vêm de API real no protótipo): lista de criaturas do Ciclope, posts iniciais da Penélope, contatos da Central Divina, respostas do SOS, notificações da Home — todos hardcoded em arrays no topo do arquivo de lógica.

## Design Tokens

### Cores
- Fundo do device: `#EFE2C4` (papiro/cerâmica clara)
- Terracota primário: `#BF5B33` (CTAs, acento de ícones ativos, transição de tab)
- Terracota escuro: `#8F4023` (texto de destaque, pontos de rota)
- Vermelho de perigo: `#9C2E1E` (alertas, ameaça crítica, Poseidon irritado)
- Azul-Egeu profundo: `#17454F` (CTAs secundários, ícones, contatos)
- Azul-Egeu claro: `#2B6E82` (detalhes de mapa/onda)
- Dourado envelhecido: `#B9924A` (linhas de rota original, avisos)
- Bege cartão: `#E3D3A8` (cards secundários, chips inativos)
- Bege claro/creme: `#F3E4C1` (cards de aviso), `#fff8e8` (cards brancos/post)
- Verde oliva (Penélope): `#dfe9dc` fundo / `#6E8F4B` borda-acento
- Texto principal: `#2E2418`; texto secundário: `#5B4C36`; texto terciário: `#8a7a63`
- Status: online `#6E8F4B`, away `#B9924A`, busy `#8F4023`, danger `#9C2E1E`, blocked/waiting `#8a7a63`/`#5B4C36`

### Tipografia
- Títulos/inscrições: **Cinzel** (Google Fonts), pesos 600/700/900, letter-spacing 1–6px conforme hierarquia — efeito "pedra gravada".
- Corpo/UI: **Inter**, pesos 400–700.
- Escala usada: 34px (splash), 26px (nome herói), 24px (títulos de tela), 20px (valores de destaque), 16px (nome de criatura), 13–14px (corpo/botões), 11–12px (legendas), 9–10px (badges/microtexto).

### Espaçamento e forma
- Padding padrão de tela: 20px horizontal, 100px inferior (espaço p/ nav+FAB).
- Radius: 10px (inputs/pequenos), 12–14px (cards padrão), 16–18px (cards grandes/modais), 20px (pills/toggles), 50% (avatares, FAB, botões de ícone).
- Gap entre cards: 8–10px.
- Sombras: cards elevados usam `box-shadow` suave (ex. `0 6px 16px rgba(0,0,0,.3)` em toasts, `0 10px 24px rgba(0,0,0,.25)` em dropdowns/modais).
- Bottom nav: altura 64px, fundo `#E3D3A8`.
- Device frame de referência: 390×844px (proporção iPhone), sem bezel no protótipo (mockup "tela nua").

### Ícones
Todos em SVG, traço fino (`stroke-width: 1.5–1.6`), sem preenchimento sólido (exceto pequenos detalhes) — estilo linear inspirado em figuras de vaso ático, não ilustrações detalhadas.

## Assets
Nenhuma imagem bitmap usada — todas as ilustrações (mapa, ciclope, ícones de nav, clima) são SVG desenhado inline. Fontes via Google Fonts (`Cinzel`, `Inter`), carregadas por `<link>`.

## Files
- `Itaca App.dc.html` — protótipo completo (todas as telas, lógica de estado, animações). Este é o arquivo de referência principal; abra em um navegador para ver o comportamento ao vivo.
