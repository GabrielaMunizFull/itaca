/**
 * Estado global — Ãtaca App
 *
 * Espelha o comportamento da classe `Component` do protótipo
 * `Itaca App.dc.html` (métodos `completeOnboarding`, `toggleMast`,
 * `toggleEarplugs`, `registerSiren`, `saveSettings`, `pickCreature`,
 * `runScan`), restrito ao escopo do MVP (sem Penélope/Divina/dark mode).
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
  setHasHydrated: (v: boolean) => void;
}

function generateLogId(): string {
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
