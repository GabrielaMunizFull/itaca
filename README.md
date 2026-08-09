# Ítaca

> App mobile satírico de "navegação/sobrevivência" para heróis em jornadas épicas intermináveis, inspirado na Odisseia de Homero.

A piada é literal: o app mostra um ETA de **"3 dias"** e um histórico real de **"9 anos, 11 meses"**. Entre uma tela e outra, você amarra o herói no mastro pra sobreviver ao canto de sereia, escaneia "criaturas mitológicas" com a câmera de verdade (via IA), manda sinal de vida pra Penélope e pede socorro aos deuses do Olimpo.

## Telas

- **Splash** — mapa se desenhando e se rasgando ao meio
- **Onboarding** — escolha de arquétipo, nome do herói e do navio
- **Home** — ETA duplo, mapa da rota, próximos desvios
- **Alerta de Sereia** — geofencing de zona de perigo, toggles de mitigação, contador de sereias evitadas
- **Scanner de Ciclope** — aponta a câmera pra qualquer coisa e uma IA de visão "detecta" qual monstro grego combina com a imagem
- **Status para Penélope** — feed de "provas de vida" automáticas, com reações
- **Central de Ajuda Divina** — contatos divinos, silenciar Poseidon, SOS aos deuses
- **Configurações** — editar herói/navio, modo noturno

## Stack

**App (`mobile/`)**
- React Native + Expo + TypeScript
- React Navigation (bottom tabs)
- Zustand (estado global) + AsyncStorage (persistência)
- `react-native-svg` (ilustrações), `expo-camera` (scanner)
- Jest + React Native Testing Library

**Backend (`server/`)**
- Node + Express + TypeScript
- `@anthropic-ai/sdk` (Claude, visão) — único endpoint (`POST /scan`) que analisa a foto do Scanner de Ciclope

## Estrutura

```
itaca/
├── mobile/              # app React Native/Expo
│   └── src/
│       ├── screens/
│       ├── components/
│       ├── navigation/
│       ├── store/        # Zustand
│       ├── theme/         # design tokens + modo noturno
│       └── utils/
├── server/               # backend Node/Express (detecção de imagem via IA)
├── docs/
│   └── design-handoff.md # spec de design original (protótipo hifi)
└── Itaca App.dc.html     # protótipo interativo de referência
```

## Como rodar

### App

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS).

### Backend (opcional — habilita a detecção real de imagem)

```bash
cd server
npm install
cp .env.example .env   # preencha ANTHROPIC_API_KEY (console.anthropic.com)
npm run dev
```

No `mobile/.env` (copie de `.env.example`), aponte `EXPO_PUBLIC_API_URL` pro IP local da sua máquina (não `localhost`) — necessário pra funcionar num celular físico na mesma rede Wi-Fi:

```
EXPO_PUBLIC_API_URL=http://SEU-IP-LOCAL:3000
```

Sem o backend rodando, o Scanner de Ciclope cai automaticamente no modo simulado (mock).

### Testes

```bash
cd mobile
npm test
```

### Gerar um APK

```bash
cd mobile
npx eas login
npx eas build --profile preview --platform android
```

## Referência de design

O app foi construído a partir de um protótipo de alta fidelidade: [`Itaca App.dc.html`](./Itaca%20App.dc.html) (abra num navegador pra ver o comportamento original) e a spec completa em [`docs/design-handoff.md`](./docs/design-handoff.md).

## Convenções do projeto

Ver [`CLAUDE.md`](./CLAUDE.md).
