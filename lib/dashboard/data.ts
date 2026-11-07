import { supabaseServer } from '@/lib/supabase-server';
import type { QuoteLine } from '@/lib/pricing';
import type { DashOrder, DashQuote, LossReason, OrderStatus } from './types';

const SELECT =
  'id, event_date, event_type, guests, decor, venue, notes, status, loss_reason, created_at, ' +
  'customers(name, phone, email), ' +
  'quotes(total, breakdown, public_token, sent_at, viewed_at)';

type QuoteRow = {
  total: number | string;
  breakdown: { lines?: QuoteLine[]; entradaPct?: number } | null;
  public_token: string;
  sent_at: string;
  viewed_at: string | null;
};
type Row = {
  id: string;
  event_date: string;
  event_type: DashOrder['eventType'];
  guests: number;
  decor: string | null;
  venue: string | null;
  notes: string | null;
  status: string | null;
  loss_reason: string | null;
  created_at: string;
  customers: { name: string; phone: string; email: string | null } | null;
  quotes: QuoteRow[] | null;
};

const STATUSES: OrderStatus[] = ['quote_sent', 'viewed', 'won', 'lost'];

function toQuote(rows: QuoteRow[] | null): DashQuote | null {
  if (!rows?.length) return null;
  const q = [...rows].sort((a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at))[0]; // o mais recente
  return {
    total: Number(q.total),
    lines: q.breakdown?.lines ?? [],
    entradaPct: q.breakdown?.entradaPct ?? 0.6,
    token: q.public_token,
    sentAt: q.sent_at,
    viewedAt: q.viewed_at,
  };
}

function toOrder(r: Row): DashOrder {
  return {
    id: r.id,
    eventDate: r.event_date,
    eventType: r.event_type,
    guests: r.guests,
    decor: r.decor,
    venue: r.venue,
    notes: r.notes,
    status: STATUSES.includes(r.status as OrderStatus) ? (r.status as OrderStatus) : 'quote_sent',
    lossReason: (r.loss_reason as LossReason | null) ?? null,
    createdAt: r.created_at,
    customer: r.customers ?? { name: 'Cliente', phone: '', email: null },
    quote: toQuote(r.quotes),
  };
}

export type Result<T> = { ok: true; data: T } | { ok: false };

/** Todos os pedidos, por data do evento (mais próxima primeiro). Só roda no servidor. */
export async function fetchOrders(): Promise<Result<DashOrder[]>> {
  const { data, error } = await supabaseServer().from('orders').select(SELECT).order('event_date', { ascending: true });
  if (error || !data) return { ok: false };
  return { ok: true, data: (data as unknown as Row[]).map(toOrder) };
}

export async function fetchOrder(id: string): Promise<Result<DashOrder | null>> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: true, data: null };
  const { data, error } = await supabaseServer().from('orders').select(SELECT).eq('id', id).maybeSingle();
  if (error) return { ok: false };
  return { ok: true, data: data ? toOrder(data as unknown as Row) : null };
}
