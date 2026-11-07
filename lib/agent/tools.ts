import type { OpenAI } from 'openai';
import { computeMissing, mergeDraft, type Draft, type DraftErrors, type DraftField } from './schema';

export const updateOrderDraftTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'update_order_draft',
    description:
      'Registra no rascunho do pedido as informações que a cliente acabou de dar. ' +
      'Chame sempre que a cliente informar ou corrigir algo sobre o evento, incluindo no objeto APENAS os campos ' +
      'que ela mencionou nesta mensagem. Depois de chamar, responda à cliente com texto.',
    parameters: {
      type: 'object',
      properties: {
        eventType: {
          type: 'string',
          enum: ['wedding', 'birthday', 'corporate', 'other'],
          description: 'Tipo de festa: casamento (wedding), aniversário (birthday), corporativo (corporate) ou outro (other).',
        },
        eventDate: {
          type: 'string',
          description: 'Data do evento no formato AAAA-MM-DD, futura. Converta datas relativas usando a data de hoje.',
        },
        guests: {
          type: 'integer',
          description: 'Número de convidados, inteiro entre 1 e 500.',
        },
        decor: {
          type: 'string',
          enum: ['simple', 'elaborate', 'premium'],
          description: 'Nível de decoração: simples (simple), elaborada (elaborate) ou premium (premium).',
        },
        venue: { type: 'string', description: 'Local do evento (nome do espaço, bairro ou cidade).' },
        notes: {
          type: 'string',
          description: 'Observações relevantes: alergias, restrições, pedidos especiais ou algo fora do padrão.',
        },
        name: { type: 'string', description: 'Nome da cliente.' },
        phone: { type: 'string', description: 'Telefone ou WhatsApp da cliente, com DDD.' },
        email: { type: 'string', description: 'E-mail da cliente, se ela informar.' },
      },
      additionalProperties: false,
    },
  },
};

export type ToolResult = {
  /** Conteúdo serializado para devolver ao modelo (mensagem role: tool). */
  content: string;
  draft: Draft;
  missing: DraftField[];
  errors: DraftErrors;
};

/** Executa uma ferramenta pedida pelo modelo. Nunca lança exceção. */
export function runTool(name: string, argsJson: string, currentDraft: Draft): ToolResult {
  const missingOf = (d: Draft) => computeMissing(d);

  if (name !== 'update_order_draft') {
    return {
      content: JSON.stringify({ error: 'ferramenta desconhecida' }),
      draft: currentDraft,
      missing: missingOf(currentDraft),
      errors: {},
    };
  }

  let args: unknown;
  try {
    args = JSON.parse(argsJson || '{}');
  } catch {
    return {
      content: JSON.stringify({ error: 'argumentos não são um JSON válido; chame de novo com JSON válido' }),
      draft: currentDraft,
      missing: missingOf(currentDraft),
      errors: {},
    };
  }

  const { draft, errors } = mergeDraft(currentDraft, args);
  const missing = missingOf(draft);
  return { content: JSON.stringify({ draft, missing, errors }), draft, missing, errors };
}
