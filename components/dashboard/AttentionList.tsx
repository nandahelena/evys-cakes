import Link from 'next/link';
import { brl, EVENT_TYPE_LABEL } from '@/lib/labels';
import { daysSince, formatDateBR, sinceLabel } from '@/lib/dashboard/logic';
import type { DashOrder } from '@/lib/dashboard/types';
import { FollowUpButton } from './FollowUpButton';
import { FollowUpBadge, StatusBadge } from './StatusBadge';

/** Orçamentos abertos há mais de 2 dias, do mais antigo ao mais recente. Se não houver nenhum, não mostra nada. */
export function AttentionList({ orders, now }: { orders: DashOrder[]; now: number }) {
  if (orders.length === 0) return null;

  return (
    <section className="attn" aria-labelledby="attn-title">
      <h2 id="attn-title" className="attn-title">
        Precisam de atenção <span>{orders.length}</span>
      </h2>
      <p className="small attn-lead">Orçamentos sem resposta há mais de 2 dias. Um oi pode retomar a conversa.</p>
      <ul className="attn-list">
        {orders.map((o) => (
          <li key={o.id} className="ord-card attn-card">
            <div className="ord-card-top">
              <Link href={`/dashboard/orders/${o.id}`} className="ord-name">
                {o.customer.name}
              </Link>
              <FollowUpBadge />
            </div>
            <p className="ord-meta">
              {EVENT_TYPE_LABEL[o.eventType]} em {formatDateBR(o.eventDate)} · <StatusBadge status={o.status} />
            </p>
            <div className="ord-card-bottom">
              <span>
                <b>{o.quote ? brl(o.quote.total) : '—'}</b> · enviado {o.quote ? sinceLabel(daysSince(o.quote.sentAt, now)) : '—'}
              </span>
              {o.quote && <FollowUpButton customer={o.customer} eventType={o.eventType} token={o.quote.token} />}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
