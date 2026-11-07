import type { QuoteLine } from '@/lib/pricing';
import type { OrderDraft } from '@/lib/types';
import type { LOSS_REASON_LABEL } from '@/lib/labels';

export type OrderStatus = 'quote_sent' | 'viewed' | 'won' | 'lost';
export type LossReason = keyof typeof LOSS_REASON_LABEL;

export type DashQuote = {
  total: number;
  lines: QuoteLine[];
  entradaPct: number;
  token: string;
  sentAt: string; // timestamptz ISO
  viewedAt: string | null;
};

/** Pedido já normalizado para o painel: cliente embutido e o orçamento mais recente. */
export type DashOrder = {
  id: string;
  eventDate: string; // YYYY-MM-DD
  eventType: OrderDraft['eventType'];
  guests: number;
  decor: string | null;
  venue: string | null;
  notes: string | null;
  status: OrderStatus;
  lossReason: LossReason | null;
  createdAt: string;
  customer: { name: string; phone: string; email: string | null };
  quote: DashQuote | null;
};
