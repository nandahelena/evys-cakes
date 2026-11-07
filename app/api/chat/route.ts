import { NextResponse, type NextRequest } from 'next/server';
import {
  AgentConfigError,
  AgentProviderError,
  AgentValidationError,
  MAX_MESSAGES,
  RateLimited,
  runAgentTurn,
} from '@/lib/agent/run';
import { computeMissing, mergeDraft } from '@/lib/agent/schema';

// Runtime Node.js é o padrão. Não exportamos `runtime` (nem `dynamic`) porque
// essas opções de segmento são incompatíveis com cacheComponents no Next 16.
// POST não é cacheado.

const GENERIC_ERROR =
  'Tive um probleminha aqui. Você pode tentar de novo ou falar com a Evelyn pelo WhatsApp.';
const BUSY_ERROR =
  'Estou com muitas conversas agora. Tente de novo em instantes ou fale com a Evelyn pelo WhatsApp.';
const LIMIT_REPLY =
  'Nossa conversa já ficou longa por aqui. Para continuar, você pode usar o formulário (o que já respondeu fica preenchido) ou falar com a Evelyn pelo WhatsApp.';

// Rate limit simples em memória, por IP: 20 requisições a cada 10 minutos.
// Em produção (várias instâncias serverless) isto seria Upstash/Redis,
// porque cada instância tem a sua própria memória.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

const error = (status: number, message: string) => NextResponse.json({ error: message }, { status });

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) return error(429, BUSY_ERROR);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error(400, 'Não consegui entender a mensagem. Tente de novo.');
  }
  const { messages, draft } = (body ?? {}) as { messages?: unknown; draft?: unknown };

  // Conversa longa demais: responde sem chamar o provedor.
  if (Array.isArray(messages) && messages.length > MAX_MESSAGES) {
    const safeDraft = mergeDraft({}, draft).draft;
    return NextResponse.json({
      reply: LIMIT_REPLY,
      draft: safeDraft,
      missing: computeMissing(safeDraft),
      ready: computeMissing(safeDraft).length === 0,
    });
  }

  try {
    const result = await runAgentTurn({ messages: messages as never, draft });
    return NextResponse.json({
      reply: result.reply,
      draft: result.draft,
      missing: result.missing,
      ready: result.ready,
    });
  } catch (err) {
    if (err instanceof AgentValidationError) {
      return error(400, 'Não consegui entender a mensagem. Tente de novo.');
    }
    if (err instanceof RateLimited) return error(429, BUSY_ERROR);
    if (err instanceof AgentProviderError) return error(502, GENERIC_ERROR);
    if (err instanceof AgentConfigError) return error(500, GENERIC_ERROR);
    return error(500, GENERIC_ERROR);
  }
}
