import { LOSS_REASON_LABEL } from '@/lib/labels';
import type { DashOrder, LossReason } from './types';

export const DAY = 86_400_000;
export const STALE_DAYS = 2;

export type Filter = 'todos' | 'parados' | 'fechados' | 'perdidos';
export const FILTERS: { key: Filter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'parados', label: 'Parados' },
  { key: 'fechados', label: 'Fechados' },
  { key: 'perdidos', label: 'Perdidos' },
];

export function parseFilter(raw: string | string[] | undefined): Filter {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return FILTERS.some((f) => f.key === v) ? (v as Filter) : 'todos';
}

/** Dias inteiros desde o envio do orçamento. */
export function daysSince(iso: string, now: number): number {
  return Math.max(0, Math.floor((now - Date.parse(iso)) / DAY));
}

export function sinceLabel(days: number): string {
  if (days <= 0) return 'hoje';
  return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

/** "Parado": ainda aberto (quote_sent ou viewed) e orçamento enviado há mais de 2 dias. */
export function isStale(o: DashOrder, now: number): boolean {
  if (o.status !== 'quote_sent' && o.status !== 'viewed') return false;
  if (!o.quote) return false;
  return now - Date.parse(o.quote.sentAt) > STALE_DAYS * DAY;
}

export function applyFilter(orders: DashOrder[], filter: Filter, now: number): DashOrder[] {
  switch (filter) {
    case 'parados':
      return orders.filter((o) => isStale(o, now));
    case 'fechados':
      return orders.filter((o) => o.status === 'won');
    case 'perdidos':
      return orders.filter((o) => o.status === 'lost');
    default:
      return orders;
  }
}

/** Parados do mais antigo ao mais recente (o que esfria há mais tempo vem primeiro). */
export function staleOrders(orders: DashOrder[], now: number): DashOrder[] {
  return orders
    .filter((o) => isStale(o, now))
    .sort((a, b) => Date.parse(a.quote!.sentAt) - Date.parse(b.quote!.sentAt));
}

// --- Datas e telefone (pt-BR) ---

/** 'YYYY-MM-DD' -> 'dd/MM/yyyy', sem passar por fuso horário. */
export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
export function formatDateTimeBR(iso: string): string {
  return dateTimeFmt.format(new Date(iso)).replace(', ', ' às ');
}

export function formatPhone(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2); // tira o código do país
  const m = /^(\d{2})(9?\d{4})(\d{4})$/.exec(d);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : phone;
}

/** Link wa.me para o telefone da cliente (acrescenta 55 se vier sem o código do país). */
export function whatsappUrl(phone: string, text: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

// --- Mensagem de follow-up ---

const EVENT_NOUN: Record<DashOrder['eventType'], string> = {
  wedding: 'casamento',
  birthday: 'aniversário',
  corporate: 'evento corporativo',
  other: 'evento',
};
export const eventNoun = (t: DashOrder['eventType']) => EVENT_NOUN[t];

export function followUpMessage(o: DashOrder, quoteUrl: string): string {
  const first = o.customer.name.split(' ')[0];
  if (o.eventType === 'wedding') {
    return (
      `Oi ${first}! Tudo bem? Passando com carinho para saber se você já conseguiu olhar o orçamento do seu casamento. ` +
      `Se quiser, posso te mostrar mais do meu trabalho e tirar qualquer dúvida, é só me falar. ` +
      `O orçamento continua aqui: ${quoteUrl}`
    );
  }
  return (
    `Oi ${first}! Tudo bem? Passando para saber se você ficou com alguma dúvida sobre o orçamento do seu ${EVENT_NOUN[o.eventType]}. ` +
    `Posso te ajudar com algo?`
  );
}

// --- Contadores ---

export type Stats = {
  sent: number;
  won: number;
  lost: number;
  conversionPct: number | null; // fechados / enviados, em %
  followUps: number;
  topLossReason: { reason: LossReason; label: string; count: number } | null;
};

export function computeStats(orders: DashOrder[], now: number): Stats {
  const withQuote = orders.filter((o) => o.quote);
  const won = withQuote.filter((o) => o.status === 'won').length;
  const lostOrders = withQuote.filter((o) => o.status === 'lost');

  const counts = new Map<LossReason, number>();
  for (const o of lostOrders) if (o.lossReason) counts.set(o.lossReason, (counts.get(o.lossReason) ?? 0) + 1);
  let top: Stats['topLossReason'] = null;
  for (const [reason, count] of counts) {
    if (!top || count > top.count) top = { reason, label: LOSS_REASON_LABEL[reason], count };
  }

  return {
    sent: withQuote.length,
    won,
    lost: lostOrders.length,
    conversionPct: withQuote.length ? Math.round((won / withQuote.length) * 100) : null,
    followUps: orders.filter((o) => isStale(o, now)).length,
    topLossReason: top,
  };
}
