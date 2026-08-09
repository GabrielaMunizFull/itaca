/**
 * Cliente da API do backend — Ítaca App
 *
 * Fala com `server/` (Node/Express local) para trocar a detecção mock do
 * Scanner de Ciclope por análise real de imagem via Claude (visão). Requer
 * `EXPO_PUBLIC_API_URL` configurada em `mobile/.env` (ver `.env.example`).
 */

export interface ScanCreatureResult {
  creatureId: string;
  reason: string;
}

export async function scanCreatureFromPhoto(
  base64: string,
  mimeType: string,
  timeoutMs = 15000
): Promise<ScanCreatureResult> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada — defina em mobile/.env.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${apiUrl}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, mimeType }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Falha ao escanear imagem (status ${response.status}).`);
    }

    return (await response.json()) as ScanCreatureResult;
  } finally {
    clearTimeout(timer);
  }
}
