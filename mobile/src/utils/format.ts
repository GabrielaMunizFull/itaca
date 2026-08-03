/**
 * Utilitários de formatação compartilhados — Ãtaca App
 */

// Formata "HH:MM" (equivalente a `toLocaleTimeString('pt-BR', { hour:
// '2-digit', minute: '2-digit' })` usado no protótipo).
export function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
