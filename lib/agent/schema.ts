import { z } from 'zod';
import type { OrderDraft } from '../types';

export type Draft = Partial<OrderDraft>;
// `items` (o carrinho) não é coletado pelo agente: a cliente escolhe os doces no cardápio.
export type DraftField = Exclude<keyof OrderDraft, 'items'>;
export type DraftErrors = Partial<Record<DraftField, string>>;

export const REQUIRED_FIELDS = [
  'eventType',
  'eventDate',
  'guests',
  'name',
  'phone',
] as const satisfies readonly DraftField[];

const KNOWN_FIELDS: readonly DraftField[] = [
  'eventDate',
  'eventType',
  'guests',
  'decor',
  'venue',
  'notes',
  'name',
  'phone',
  'email',
];

/** Data de hoje (YYYY-MM-DD) no fuso America/Sao_Paulo. */
export function todayInSaoPaulo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function toUtcDay(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function isValidCalendarDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** Devolve null se a data for aceitável; senão, a mensagem de erro. */
function checkEventDate(iso: string, today: string): string | null {
  if (!isValidCalendarDate(iso)) return 'a data precisa estar no formato AAAA-MM-DD e existir no calendário';
  const diffDays = (toUtcDay(iso) - toUtcDay(today)) / 86_400_000;
  if (diffDays < 1) return 'a data precisa ser futura';
  const limit = new Date(toUtcDay(today));
  limit.setUTCFullYear(limit.getUTCFullYear() + 2);
  if (toUtcDay(iso) > limit.getTime()) return 'a data pode ser no máximo 2 anos à frente';
  return null;
}

// --- Schemas por campo (zod) ---

const strip = (s: string) => s.replace(/[<>]/g, '').trim();

const fieldSchemas = {
  eventType: z.enum(['wedding', 'birthday', 'corporate', 'other']),
  // Mesmos limites do formulário do site (/pedido), para o rascunho preencher o formulário sem erro.
  decor: z.string().transform(strip).pipe(z.string().min(1).max(600)),
  guests: z.number().int().min(1).max(5000),
  name: z.string().transform(strip).pipe(z.string().min(2).max(80)),
  phone: z
    .string()
    .transform((s) => s.replace(/\D/g, ''))
    .pipe(z.string().min(10).max(13)),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(120)),
  venue: z.string().transform(strip).pipe(z.string().min(1).max(200)),
  notes: z.string().transform(strip).pipe(z.string().min(1).max(600)),
} as const;

const FIELD_ERRORS: Record<DraftField, string> = {
  eventDate: 'a data é inválida',
  eventType: 'o tipo de festa precisa ser casamento, aniversário, corporativo ou outro',
  guests: 'o número de convidados precisa ser um inteiro entre 1 e 5000',
  decor: 'a descrição da decoração pode ter no máximo 600 caracteres',
  name: 'o nome precisa ter de 2 a 80 caracteres',
  phone: 'o telefone precisa ter de 10 a 13 dígitos (com DDD)',
  email: 'o e-mail é inválido',
  venue: 'o local pode ter no máximo 200 caracteres',
  notes: 'as observações podem ter no máximo 600 caracteres',
};

/** Schema de patch: todos os campos opcionais, validados campo a campo em mergeDraft. */
export const DraftPatchSchema = z.object({
  eventDate: z.string().optional(),
  eventType: fieldSchemas.eventType.optional(),
  guests: z.number().optional(),
  decor: z.string().optional(),
  venue: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

type FieldResult = { ok: true; value: unknown } | { ok: false; error: string };

function validateField(field: DraftField, raw: unknown, today: string): FieldResult {
  const fail = (error = FIELD_ERRORS[field]): FieldResult => ({ ok: false, error });

  if (field === 'eventDate') {
    if (typeof raw !== 'string') return fail();
    const iso = raw.trim();
    const err = checkEventDate(iso, today);
    return err ? fail(err) : { ok: true, value: iso };
  }

  if (field === 'guests') {
    let n: unknown = raw;
    if (typeof raw === 'string' && /^\s*\d+\s*$/.test(raw)) n = Number(raw);
    const r = fieldSchemas.guests.safeParse(n);
    return r.success ? { ok: true, value: r.data } : fail();
  }

  if (typeof raw === 'number' && (field === 'phone')) raw = String(raw);
  const r = fieldSchemas[field].safeParse(raw);
  return r.success ? { ok: true, value: r.data } : fail();
}

export function computeMissing(draft: Draft, today: string = todayInSaoPaulo()): DraftField[] {
  return REQUIRED_FIELDS.filter((f) => {
    const v = draft[f];
    if (isEmpty(v)) return true;
    return !validateField(f, v, today).ok;
  });
}

export function isReady(draft: Draft, today?: string): boolean {
  return computeMissing(draft, today).length === 0;
}

/**
 * Mescla um patch no rascunho. Valida campo a campo, descarta chaves
 * desconhecidas, aceita números em string e nunca apaga valores existentes
 * com valores vazios.
 */
export function mergeDraft(
  current: Draft,
  patch: unknown,
  opts: { today?: string } = {},
): { draft: Draft; errors: DraftErrors } {
  const today = opts.today ?? todayInSaoPaulo();
  const draft: Draft = { ...current };
  const errors: DraftErrors = {};

  if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
    return { draft, errors };
  }
  const source = patch as Record<string, unknown>;

  for (const field of KNOWN_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;
    const raw = source[field];
    if (isEmpty(raw)) continue;
    const result = validateField(field, raw, today);
    if (result.ok) {
      (draft as Record<string, unknown>)[field] = result.value;
    } else {
      errors[field] = result.error;
    }
  }
  return { draft, errors };
}
