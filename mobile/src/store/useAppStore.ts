/**
 * Estado global — Ãtaca App
 *
 * Espelha o comportamento da classe `Component` do protótipo
 * `Itaca App.dc.html` (métodos `completeOnboarding`, `toggleMast`,
 * `toggleEarplugs`, `registerSiren`, `saveSettings`), restrito ao escopo do
 * MVP (sem Ciclope/Penélope/Divina/dark mode).
 *
 * Persistência: AsyncStorage, equivalente ao `localStorage` (chave
 * `itaca-mvp-state`) do protótipo original.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Archetype = 'guerreiro' | 'arqueiro' | 'timoneiro' | 'oraculo';

export interface SirenLogEntry {
  id: string;
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
  // Indica se o estado persistido já terminou de ser reidratado do
  // AsyncStorage. Usado pelo RootNavigator para evitar flash de Onboarding
  // antes da reidratação concluir.
  hasHydrated: boolean;

  completeOnboarding: (name: string, ship: string, archetype: Archetype) => void;
  toggleMast: () => void;
  toggleEarplugs: () => void;
  registerSiren: () => void;
  saveSettings: (name: string, ship: string) => void;
  setHasHydrated: (v: boolean) => void;
}

// Formata "HH:MM" (equivalente a `toLocaleTimeString('pt-BR', { hour:
// '2-digit', minute: '2-digit' })` usado no protótipo).
function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function generateSirenLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
          sirenLog: [{ id: generateSirenLogId(), time: formatTime(new Date()) }, ...s.sirenLog].slice(0, 5),
        })),

      saveSettings: (name, ship) =>
        set({
          heroName: name.trim() || 'Odisseu',
          shipName: ship.trim() || 'Argo II',
        }),

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
