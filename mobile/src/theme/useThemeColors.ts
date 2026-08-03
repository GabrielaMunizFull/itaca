/**
 * useThemeColors — Ítaca App
 *
 * Retorna a paleta de cores ativa (clara ou escura, conforme `darkMode` em
 * `useAppStore`) para consumo por componentes/telas — substitui o import
 * estático de `colors` de `./tokens`.
 */

import { useAppStore } from '../store/useAppStore';
import { colors, darkColors } from './tokens';

export function useThemeColors() {
  const darkMode = useAppStore((s) => s.darkMode);
  return darkMode ? darkColors : colors;
}
