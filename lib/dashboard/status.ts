import { LOSS_REASON_LABEL } from '@/lib/labels';
import { supabaseServer } from '@/lib/supabase-server';

export type StatusResult = { ok: true; message: string } | { ok: false; error: string };
export type StatusInput = { orderId: string; status: 'won' | 'lost' | 'quote_sent'; reason?: string };

const MESSAGE = {
  won: 'Pedido marcado como fechado.',
  lost: 'Pedido marcado como perdido.',
  quote_sent: 'Pedido reaberto.',
} as const;

/** Valida e grava o novo status do pedido. Não confere sessão: quem chama (a server action) faz isso. */
export async function applyOrderStatus(input: StatusInput): Promise<StatusResult> {
  const { orderId, status } = input;
  if (!/^[0-9a-f-]{36}$/i.test(orderId ?? '')) return { ok: false, error: 'Pedido inválido.' };
  if (status !== 'won' && status !== 'lost' && status !== 'quote_sent') return { ok: false, error: 'Status inválido.' };

  let lossReason: string | null = null;
  if (status === 'lost') {
    if (!input.reason || !Object.hasOwn(LOSS_REASON_LABEL, input.reason)) {
      return { ok: false, error: 'Escolha o motivo da perda.' };
    }
    lossReason = input.reason;
  }

  const { data, error } = await supabaseServer()
    .from('orders')
    .update({ status, loss_reason: lossReason }) // fechado e reaberto limpam o motivo
    .eq('id', orderId)
    .select('id')
    .maybeSingle();

  if (error) return { ok: false, error: 'Não foi possível salvar agora. Tente de novo.' };
  if (!data) return { ok: false, error: 'Pedido não encontrado.' };
  return { ok: true, message: MESSAGE[status] };
}
