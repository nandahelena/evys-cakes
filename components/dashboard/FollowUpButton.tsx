'use client';

import { followUpMessage, whatsappUrl } from '@/lib/dashboard/logic';
import type { DashOrder } from '@/lib/dashboard/types';
import { Icon } from '@/components/Icon';

type Props = {
  customer: DashOrder['customer'];
  eventType: DashOrder['eventType'];
  token: string;
};

/**
 * Abre o WhatsApp da CLIENTE com a mensagem pronta; a Evy só confere e aperta enviar.
 * O link do orçamento usa NEXT_PUBLIC_SITE_URL, ou o endereço em que o painel está aberto.
 */
export function FollowUpButton({ customer, eventType, token }: Props) {
  const open = () => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    const text = followUpMessage({ customer, eventType }, `${base}/quote/${token}`);
    window.open(whatsappUrl(customer.phone, text), '_blank', 'noopener,noreferrer');
  };

  return (
    <button type="button" className="btn btn-p btn-sm" onClick={open} aria-label={`Fazer follow-up com ${customer.name} pelo WhatsApp`}>
      <Icon name="i-chat" />
      Chamar no WhatsApp
    </button>
  );
}
