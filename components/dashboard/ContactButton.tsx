'use client';

import { Icon } from '@/components/Icon';
import { contactMessage, whatsappUrl } from '@/lib/dashboard/logic';
import type { DashOrder } from '@/lib/dashboard/types';

type Props = Pick<DashOrder, 'customer' | 'eventType' | 'eventDate'>;

/** Abre o WhatsApp da cliente com uma mensagem neutra sobre o evento. */
export function ContactButton({ customer, eventType, eventDate }: Props) {
  return (
    <button
      type="button"
      className="btn btn-p btn-sm"
      onClick={() => window.open(whatsappUrl(customer.phone, contactMessage({ customer, eventType, eventDate })), '_blank', 'noopener,noreferrer')}
    >
      <Icon name="i-chat" />
      WhatsApp
    </button>
  );
}
