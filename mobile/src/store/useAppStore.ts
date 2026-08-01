/**
 * Estado global — Ãtaca App
 *
 * Espelha o comportamento da classe `Component` do protótipo
 * `Itaca App.dc.html` (métodos `completeOnboarding`, `toggleMast`,
 * `toggleEarplugs`, `registerSiren`, `saveSettings`, `pickCreature`,
 * `runScan`, `sendSignal`, `addReaction`), restrito ao escopo do MVP (sem
 * Divina/dark mode).
 *
 * Persistência: AsyncStorage, equivalente ao `localStorage` (chave
 * `itaca-mvp-state`) do protótipo original.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime } from '../utils/format';

export type Archetype = 'guerreiro' | 'arqueiro' | 'timoneiro' | 'oraculo';

export interface SirenLogEntry {
  id: string;
  time: string;
}

export interface ScanHistoryEntry {
  id: string;
  name: string;
  threat: string;
  time: string;
}

export interface PostReactions {
  anchor: number;
  shield: number;
  question: number;
}

export interface Post {
  id: string;
  day: number;
  time: string;
  text: string;
  likes: number;
  dim?: boolean;
  reactions: PostReactions;
}

export type ReactionType = keyof PostReactions;

interface AppState {
  heroName: string;
  shipName: string;
  archetype: Archetype;
  onboarded: boolean;
  mastTied: boolean;
  earplugs: boolean;
  sirenCount: number;
  sirenLog: SirenLogEntry[];
  selectedCreature: string;
  scanHistory: ScanHistoryEntry[];
  // Intencionalmente sem cap (diferente de sirenLog/scanHistory): o feed de
  // Penélope é o histórico completo da jornada, não um log recente.
  posts: Post[];
  // Indica se o estado persistido já terminou de ser reidratado do
  // AsyncStorage. Usado pelo RootNavigator para evitar flash de Onboarding
  // antes da reidratação concluir.
  hasHydrated: boolean;

  completeOnboarding: (name: string, ship: string, archetype: Archetype) => void;
  toggleMast: () => void;
  toggleEarplugs: () => void;
  registerSiren: () => void;
  saveSettings: (name: string, ship: string) => void;
  pickCreature: (id: string) => void;
  addScanToHistory: (entry: { name: string; threat: string; time: string }) => void;
  sendSignal: () => void;
  addReaction: (postId: string, type: ReactionType) => void;
  setHasHydrated: (v: boolean) => void;
}

// Posts iniciais do feed da Penélope — copiados 1:1 de `POSTS` em
// `Itaca App.dc.html`.
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    day: 1,
    time: '08:12',
    text: 'Ainda vivo. Ainda voltando. Tudo sob controle.',
    likes: 214,
    reactions: { anchor: 34, shield: 12, question: 5 },
  },
  {
    id: 'post-47',
    day: 47,
    time: '19:40',
    text: 'Pequeno imprevisto com um ciclope. Perdemos 2 navios. Moral: variável.',
    likes: 189,
    reactions: { anchor: 21, shield: 40, question: 18 },
  },
  {
    id: 'post-312',
    day: 312,
    time: '11:05',
    text: 'Feiticeira transformou a tripulação em porcos. Já resolvido. Ainda voltando.',
    likes: 301,
    reactions: { anchor: 19, shield: 8, question: 52 },
  },
  {
    id: 'post-1876',
    day: 1876,
    time: '22:58',
    text: 'Detido em ilha por ninfa imortal. Definitivamente voltando. Em breve.',
    likes: 88,
    dim: true,
    reactions: { anchor: 6, shield: 3, question: 61 },
  },
  {
    id: 'post-3442',
    day: 3442,
    time: '06:03',
    text: 'Ainda vivo. Ainda voltando. (repetir diariamente há 9 anos)',
    likes: 412,
    reactions: { anchor: 88, shield: 14, question: 97 },
  },
];

export function generateLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function prependCapped<T>(list: T[], entry: T, cap: number): T[] {
  return [entry, ...list].slice(0, cap);
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      heroName: 'Odisseu',
      shipName: 'Argo II',
      archetype: 'guerreiro',
      onboarded: false,
      mastTied: true,
      earplugs: true,
      sirenCount: 47,
      sirenLog: [],
      selectedCreature: 'polifemo',
      scanHistory: [],
      posts: INITIAL_POSTS,
      hasHydrated: false,

      completeOnboarding: (name, ship, archetype) =>
        set({
          onboarded: true,
          heroName: name.trim() || 'Odisseu',
          shipName: ship.trim() || 'Argo II',
          archetype,
        }),

      toggleMast: () => set((s) => ({ mastTied: !s.mastTied })),

      toggleEarplugs: () => set((s) => ({ earplugs: !s.earplugs })),

      registerSiren: () =>
        set((s) => ({
          sirenCount: s.sirenCount + 1,
          sirenLog: prependCapped(s.sirenLog, { id: generateLogId(), time: formatTime(new Date()) }, 5),
        })),

      saveSettings: (name, ship) =>
        set({
          heroName: name.trim() || 'Odisseu',
          shipName: ship.trim() || 'Argo II',
        }),

      pickCreature: (id) => set({ selectedCreature: id }),

      addScanToHistory: (entry) =>
        set((s) => ({
          scanHistory: prependCapped(s.scanHistory, { id: generateLogId(), ...entry }, 3),
        })),

      sendSignal: () =>
        set((s) => {
          const lastDay = s.posts[0]?.day ?? 0;
          const newPost: Post = {
            id: generateLogId(),
            day: lastDay + Math.floor(Math.random() * 5) + 1,
            time: formatTime(new Date()),
            text: 'Sinal manual: ainda vivo, ainda voltando. (enviado por vontade própria, raro)',
            likes: Math.floor(Math.random() * 90) + 40,
            reactions: { anchor: 0, shield: 0, question: 0 },
          };
          return { posts: [newPost, ...s.posts] };
        }),

      addReaction: (postId, type) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p
          ),
        })),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'itaca-mvp-state',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        heroName: s.heroName,
        shipName: s.shipName,
        archetype: s.archetype,
        onboarded: s.onboarded,
        mastTied: s.mastTied,
        earplugs: s.earplugs,
        sirenCount: s.sirenCount,
        sirenLog: s.sirenLog,
        selectedCreature: s.selectedCreature,
        scanHistory: s.scanHistory,
        posts: s.posts,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('[itaca] falha ao restaurar estado persistido', error);
        }
        useAppStore.getState().setHasHydrated(true);
      },
    }
  )
);
