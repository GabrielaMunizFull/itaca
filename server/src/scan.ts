/**
 * Handler de `POST /scan` — Ítaca App (backend)
 *
 * Recebe uma foto em base64, envia pro Claude (visão) com uma tool forçada
 * (`detectar_criatura`) e devolve qual das 5 criaturas mitológicas do
 * Scanner de Ciclope foi "detectada", com uma justificativa curta e irônica.
 */

import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { CREATURES } from './creatures';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

const CREATURE_IDS = CREATURES.map((c) => c.id) as [string, ...string[]];
const VALID_CREATURE_IDS = new Set(CREATURE_IDS);

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

function isAllowedMimeType(value: string): value is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

const SYSTEM_PROMPT = `Você é o motor de "detecção de criaturas" do Ítaca, um app mobile satírico de
sobrevivência inspirado na Odisseia de Homero. Você vai receber uma foto tirada pelo usuário e deve
"fingir" que detectou, na imagem, uma das 5 criaturas mitológicas do jogo — escolha a que mais combina
de forma bem-humorada com o conteúdo da foto (cores, formas, objetos, ambiente, expressão — qualquer
coisa serve de gancho pra piada). Escreva uma frase curta e engraçada explicando a "detecção", sempre no
tom satírico e leve do app. Nunca faça afirmações factuais sérias sobre pessoas reais que apareçam na
foto — mantenha tudo como brincadeira, nunca como comentário real sobre a aparência ou identidade de
alguém. Use sempre a ferramenta "detectar_criatura" para responder.`;

const detectTool: Anthropic.Tool = {
  name: 'detectar_criatura',
  description: 'Registra qual criatura mitológica foi detectada na imagem',
  input_schema: {
    type: 'object',
    properties: {
      creatureId: { type: 'string', enum: CREATURE_IDS },
      reason: {
        type: 'string',
        description: 'Justificativa curta e irônica de por que essa criatura foi detectada na imagem, no tom satírico do app Ítaca',
      },
    },
    required: ['creatureId', 'reason'],
  },
};

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 20_000 });
  }
  return anthropicClient;
}

export async function handleScan(req: Request, res: Response): Promise<void> {
  const { image, mimeType } = req.body ?? {};

  if (!image || typeof image !== 'string') {
    res.status(400).json({ error: 'Campo "image" (base64) é obrigatório.' });
    return;
  }

  const rawMimeType: string = typeof mimeType === 'string' && mimeType ? mimeType : 'image/jpeg';
  const resolvedMimeType: AllowedMimeType = isAllowedMimeType(rawMimeType) ? rawMimeType : 'image/jpeg';

  console.log(`[itaca-server] /scan recebeu imagem (${Math.round((image.length * 3) / 4)} bytes aprox.)`);

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      tools: [detectTool],
      tool_choice: { type: 'tool', name: 'detectar_criatura' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: resolvedMimeType,
                data: image,
              },
            },
            {
              type: 'text',
              text: 'Detecte qual criatura mitológica combina com esta foto.',
            },
          ],
        },
      ],
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use' && block.name === 'detectar_criatura'
    );

    if (!toolUse) {
      throw new Error('Resposta do modelo sem tool_use esperado.');
    }

    const input = toolUse.input as { creatureId?: string; reason?: string };

    if (!input.creatureId || !input.reason) {
      throw new Error('Resposta do modelo incompleta.');
    }

    if (!VALID_CREATURE_IDS.has(input.creatureId)) {
      console.error(`[itaca-server] creatureId inesperado da IA: "${input.creatureId}"`);
      throw new Error('Resposta do modelo com creatureId inválido.');
    }

    res.status(200).json({ creatureId: input.creatureId, reason: input.reason });
  } catch (err) {
    console.error('[itaca-server] falha ao processar /scan:', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Não foi possível analisar a imagem no momento.' });
  }
}
