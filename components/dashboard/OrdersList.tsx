import Link from 'next/link';
import { brl, EVENT_TYPE_LABEL } from '@/lib/labels';
import { daysSince, formatDateBR, sinceLabel, type Filter } from '@/lib/dashboard/logic';
import type { DashOrder } from '@/lib/dashboard/types';
import { OrderActions } from './OrderActions';
import { StatusBadge } from './StatusBadge';

const EMPTY: Record<Filter, string> = {
  todos: 'Ainda não há pedidos. Quando uma cliente gerar um orçamento no site, ele aparece aqui.',
  parados: 'Nenhum orçamento parado. Tudo em dia!',
  fechados: 'Nenhum pedido fechado ainda.',
  perdidos: 'Nenhum pedido perdido.',
};

const sent = (o: DashOrder, now: number) => (o.quote ? sinceLabel(daysSince(o.quote.sentAt, now)) : '—');
const value = (o: DashOrder) => (o.quote ? brl(o.quote.total) : '—');
const guests = (n: number) => `${n} ${n === 1 ? 'convidado' : 'convidados'}`;

/** Lista de pedidos: tabela a partir de 860px, cartões no celular (os dois ficam no HTML; o CSS escolhe). */
export function OrdersList({ orders, now, filter }: { orders: DashOrder[]; now: number; filter: Filter }) {
  if (orders.length === 0) {
    return (
      <p className="dash-empty" role="status">
        {EMPTY[filter]}
      </p>
    );
  }

  return (
    <>
      <div className="ord-table-wrap">
        <table className="ord-table">
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Data do evento</th>
              <th scope="col">Tipo</th>
              <th scope="col" className="num">
                Convidados
              </th>
              <th scope="col" className="num">
                Valor
              </th>
              <th scope="col">Status</th>
              <th scope="col">Orçamento enviado</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <th scope="row">
                  <Link href={`/dashboard/orders/${o.id}`}>{o.customer.name}</Link>
                </th>
                <td>{formatDateBR(o.eventDate)}</td>
                <td>{EVENT_TYPE_LABEL[o.eventType]}</td>
                <td className="num">{o.guests}</td>
                <td className="num">{value(o)}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td>{sent(o, now)}</td>
                <td>
                  <OrderActions orderId={o.id} customerName={o.customer.name} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="ord-cards">
        {orders.map((o) => (
          <li key={o.id} className="ord-card">
            <div className="ord-card-top">
              <Link href={`/dashboard/orders/${o.id}`} className="ord-name">
                {o.customer.name}
              </Link>
              <StatusBadge status={o.status} />
            </div>
            <p className="ord-meta">
              {formatDateBR(o.eventDate)} · {EVENT_TYPE_LABEL[o.eventType]} · {guests(o.guests)}
            </p>
            <div className="ord-card-bottom">
              <b>{value(o)}</b>
              <span>Enviado {sent(o, now)}</span>
            </div>
            <OrderActions orderId={o.id} customerName={o.customer.name} status={o.status} />
          </li>
        ))}
      </ul>
    </>
  );
}
