/**
 * Design Tokens — Ítaca App
 *
 * Fonte de verdade: seção "Design Tokens" do `README.md` (raiz do repo),
 * extraída de `Itaca App.dc.html`. Todos os valores abaixo batem
 * exatamente com o README; onde o README documenta uma faixa (ex: escala
 * tipográfica, radius, sombras) em vez de um único número, os degraus da
 * faixa foram nomeados semanticamente e sinalizados nos comentários.
 *
 * Consumo esperado (React Native / Expo):
 *
 *   import { colors, typography, spacing, radius } from '../theme/tokens';
 *   const styles = StyleSheet.create({
 *     card: { backgroundColor: colors.cardWhite, borderRadius: radius.md },
 *   });
 */

// ---------------------------------------------------------------------------
// Cores
// ---------------------------------------------------------------------------
export const colors = {
  // Fundo base do app (tela do device)
  background: '#EFE2C4',

  // Marca — terracota. Ação primária, destaques, CTAs.
  primary: '#BF5B33',
  // Variante escura da cor primária — estados pressed/hover, textos sobre
  // fundo claro que precisem de mais contraste, bordas de ênfase.
  primaryDark: '#8F4023',

  // Azul-Egeu — cor secundária de marca (navegação, ícones, elementos de
  // identidade que não competem com o terracota primário).
  secondary: '#17454F',
  // Variante clara do azul-Egeu — estados hover/pressed da secundária,
  // fundos leves com identidade de marca.
  secondaryLight: '#2B6E82',

  // Dourado — acentos decorativos, badges, elementos de destaque premium.
  gold: '#B9924A',

  // Neutras / superfícies
  cardBeige: '#E3D3A8', // fundo de cards padrão
  cardWhite: '#fff8e8', // fundo de cards que precisam de mais contraste/leveza
  warningCream: '#F3E4C1', // fundo de banners/avisos não críticos

  // Verde oliva — usado em conjunto (par claro/escuro) para estados
  // positivos e elementos de sucesso que não sejam o "online" de presença.
  oliveLight: '#dfe9dc',
  oliveDark: '#6E8F4B',

  // Feedback
  danger: '#9C2E1E', // erros, ações destrutivas, validações negativas

  // Texto
  textPrimary: '#2E2418', // títulos e corpo de texto principal
  textSecondary: '#5B4C36', // legendas, metadados, texto de apoio
  textTertiary: '#8a7a63', // placeholders, texto desabilitado/menos importante

  // Status de presença/estado do usuário. Valores hex definidos
  // explicitamente no README (seção Design Tokens > Cores).
  status: {
    online: '#6E8F4B', // oliveDark — presente/ativo
    away: '#B9924A', // gold — ausente temporariamente
    busy: '#8F4023', // primaryDark — ocupado, não perturbe
    danger: '#9C2E1E', // erro/perigo, ameaça crítica
    blocked: '#8a7a63', // textTertiary — bloqueado/impedido
    waiting: '#5B4C36', // textSecondary — aguardando ação/resposta
  },

  // Estado "off" de toggles/switches (`Itaca App.dc.html`, `*OnColor`
  // quando falso).
  toggleOff: '#c9bb96',

  // Fundo do card do mapa de perigo (tela Sereia).
  dangerMapBg: '#3a1712',
  // Fundo interno do SVG do mapa de perigo (rect de dentro do card acima).
  dangerMapInner: '#123038',

  // Bordas sutis `rgba(46,36,24, X)` repetidas no protótipo — apenas os
  // alphas exatamente documentados viram token; demais permanecem literais.
  borderSubtle: 'rgba(46,36,24,.08)',
  borderSubtleStrong: 'rgba(46,36,24,.15)',
} as const;

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
export const typography = {
  fontFamily: {
    // Cinzel — usada em títulos e elementos de identidade (headers, logo,
    // nomes de destaque). Carregar via expo-font com os pesos abaixo.
    heading: 'Cinzel',
    // Inter — usada em corpo de texto, labels, botões e demais componentes
    // de UI.
    body: 'Inter',
  },

  // Pesos disponíveis por família, conforme especificado.
  fontWeight: {
    heading: {
      semibold: '600',
      bold: '700',
      black: '900',
    },
    body: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Escala tipográfica — degraus exatos listados no README ("Escala
  // usada: 34px (splash), 26px (nome herói), 24px (títulos de tela),
  // 20px (valores de destaque), 16px (nome de criatura), 13–14px
  // (corpo/botões), 11–12px (legendas), 9–10px (badges/microtexto)").
  // Faixas de 2px foram nomeadas como par base/large.
  fontSize: {
    micro: 9, // badges/microtexto — piso da faixa 9–10px
    microLarge: 10, // badges/microtexto — teto da faixa 9–10px
    caption: 11, // legendas, metadados — piso da faixa 11–12px
    captionLarge: 12, // legendas, metadados — teto da faixa 11–12px
    body: 13, // corpo de texto/botões — piso da faixa 13–14px
    bodyLarge: 14, // corpo de texto/botões — teto da faixa 13–14px
    creatureName: 16, // nome de criatura
    title: 20, // valores de destaque
    titleMedium: 22, // título do Onboarding (`Itaca App.dc.html`)
    titleLarge: 24, // títulos de tela
    heroName: 26, // nome do herói
    splash: 34, // splash — maior elemento tipográfico do app
  },
} as const;

// ---------------------------------------------------------------------------
// Espaçamento
// ---------------------------------------------------------------------------
// Escala em múltiplos de 4px/8px, alinhada aos valores de padding/gap
// documentados (padding padrão de tela: 20px horizontal / 100px inferior;
// gaps: 8–10px).
export const spacing = {
  xs: 4,
  sm: 8,
  gapSm: 8, // gap padrão entre elementos pequenos (listas, chips)
  gapMd: 10, // gap padrão entre elementos médios (cards, seções curtas)
  md: 12,
  base: 16,
  lg: 20, // padding horizontal padrão de tela
  lgAlt: 22, // padding horizontal do Onboarding/Settings (`Itaca App.dc.html`)
  xl: 24,
  xxl: 32,
  screenBottom: 100, // padding inferior padrão de tela (libera espaço da bottom nav)
  bottomNavHeight: 64, // altura da barra de navegação inferior
} as const;

// ---------------------------------------------------------------------------
// Raios de borda
// ---------------------------------------------------------------------------
export const radius = {
  sm: 10, // inputs, elementos pequenos
  md: 12, // cards padrão — piso da faixa 12–14px
  mdAlt: 14, // cards padrão — teto da faixa 12–14px
  lg: 16, // cards grandes/modais — piso da faixa 16–18px
  lgAlt: 18, // cards grandes/modais — teto da faixa 16–18px
  xl: 20, // pills, toggles
  full: 9999, // avatares, FAB, botões de ícone (equivalente a 50%)
} as const;

// ---------------------------------------------------------------------------
// Sombras
// ---------------------------------------------------------------------------
// Valores documentados no README (CSS box-shadow do protótipo web),
// convertidos para o formato de elevação do React Native. Offset Y e
// shadowRadius aproximam o blur/offset do box-shadow original; elevation é
// um equivalente aproximado para Android (sem `box-shadow` nativo).
export const shadows = {
  // `0 6px 16px rgba(0,0,0,.3)` — toasts
  toast: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6, // Android
  },
  // `0 10px 24px rgba(0,0,0,.25)` — dropdowns/modais
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10, // Android
  },
} as const;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------
// NÃO documentado no README — o protótipo de referência (`Itaca App.dc.html`)
// usa um único device frame fixo (390×844px, proporção iPhone), sem layout
// responsivo especificado. Mantido como token complementar, mobile-first,
// apenas para eventual diferenciação telefone/tablet no app nativo.
export const breakpoints = {
  phone: 0,
  tablet: 768,
} as const;
