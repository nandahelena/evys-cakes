import type { OrderDraft } from './types';

export const EVENT_TYPE_LABEL: Record<OrderDraft['eventType'], string> = {
  wedding: 'Casamento',
  birthday: 'Aniversário',
  corporate: 'Evento corporativo',
  other: 'Outro',
};

export const DECOR_LABEL: Record<OrderDraft['decor'], string> = {
  simple: 'Simples',
  elaborate: 'Elaborada',
  premium: 'Premium',
};

export const STATUS_LABEL = {
  quote_sent: 'Orçamento enviado',
  viewed: 'Orçamento visualizado',
  won: 'Pedido fechado',
  lost: 'Perdido',
} as const;

export const LOSS_REASON_LABEL = {
  price: 'Preço',
  other_vendor: 'Escolheu outro fornecedor',
  date: 'Data indisponível',
  no_reply: 'Parou de responder',
  other: 'Outro motivo',
} as const;

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function brl(value: number): string {
  return brlFormatter.format(value);
}
