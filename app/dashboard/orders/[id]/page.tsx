import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { CopyLink } from '@/components/dashboard/CopyLink';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { fetchOrder } from '@/lib/dashboard/data';
import { daysSince, formatDateBR, formatDateTimeBR, formatPhone, sinceLabel } from '@/lib/dashboard/logic';
import type { DashOrder } from '@/lib/dashboard/types';
import { brl, EVENT_TYPE_LABEL, LOSS_REASON_LABEL } from '@/lib/labels';

export default function OrderPage({ params }: PageProps<'/dashboard/orders/[id]'>) {
  return (
    <>
      <Link href="/dashboard" className="back">
        ← Pedidos
      </Link>
      <Suspense fallback={<p className="small">Carregando pedido…</p>}>
        <Order params={params} />
      </Suspense>
    </>
  );
}

const row = (label: string, value: string | null | undefined) =>
  value ? (
    <div className="kv">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  ) : null;

async function Order({ params }: Pick<PageProps<'/dashboard/orders/[id]'>, 'params'>) {
  await connection();
  const { id } = await params;
  const result = await fetchOrder(id);

  if (!result.ok) {
    return (
      <p className="err" role="alert">
        Não foi possível carregar este pedido agora. Tente atualizar a página em instantes.
      </p>
    );
  }
  if (!result.data) notFound();
  const o: DashOrder = result.data;
  const q = o.quote;
  const now = Date.now();
  const entrada = q ? Math.round(q.total * q.entradaPct * 100) / 100 : 0;

  return (
    <>
      <div className="detail-head">
        <h1 className="dash-title">{o.customer.name}</h1>
        <StatusBadge status={o.status} />
      </div>
      {o.status === 'lost' && o.lossReason && <p className="small">Motivo da perda: {LOSS_REASON_LABEL[o.lossReason]}</p>}

      <div className="detail-grid">
        <section className="card dcard">
          <h2>Contato</h2>
          <dl>
            {row('Telefone', formatPhone(o.customer.phone))}
            {row('E-mail', o.customer.email)}
          </dl>
        </section>

        <section className="card dcard">
          <h2>Evento</h2>
          <dl>
            {row('Data', formatDateBR(o.eventDate))}
            {row('Tipo', EVENT_TYPE_LABEL[o.eventType])}
            {row('Convidados', String(o.guests))}
            {row('Local', o.venue)}
            {row('Decoração', o.decor)}
            {row('Observações', o.notes)}
          </dl>
        </section>

        <section className="card dcard wide">
          <h2>Orçamento</h2>
          {q ? (
            <>
              <ul className="qlines">
                {q.lines.map((l, i) => (
                  <li key={`${l.id}-${i}`}>
                    <div>
                      <b>{l.name}</b>
                      <small>
                        {String(l.qty).replace('.', ',')} {l.unit} × {brl(l.unitPrice)}
                        {l.choice ? ` · ${l.choice}` : ''}
                      </small>
                    </div>
                    <span>{brl(l.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="qsum">
                <div>
                  <dt>Total</dt>
                  <dd>{brl(q.total)}</dd>
                </div>
                <div>
                  <dt>Entrada ({Math.round(q.entradaPct * 100)}%)</dt>
                  <dd>{brl(entrada)}</dd>
                </div>
                <div>
                  <dt>Restante</dt>
                  <dd>{brl(Math.round((q.total - entrada) * 100) / 100)}</dd>
                </div>
              </dl>
              <h3 className="dsub">Link do orçamento</h3>
              <CopyLink token={q.token} />
            </>
          ) : (
            <p className="small">Este pedido ainda não tem orçamento.</p>
          )}
        </section>

        <section className="card dcard wide">
          <h2>Histórico</h2>
          <ol className="timeline">
            <li>
              <b>Pedido criado</b>
              <span>{formatDateTimeBR(o.createdAt)}</span>
            </li>
            {q && (
              <li>
                <b>Orçamento enviado</b>
                <span>
                  {formatDateTimeBR(q.sentAt)} ({sinceLabel(daysSince(q.sentAt, now))})
                </span>
              </li>
            )}
            {q && (
              <li>
                <b>{q.viewedAt ? 'Orçamento visualizado' : 'Orçamento ainda não visualizado'}</b>
                {q.viewedAt && <span>{formatDateTimeBR(q.viewedAt)}</span>}
              </li>
            )}
            <li>
              <b>Status atual</b>
              <span>
                <StatusBadge status={o.status} />
              </span>
            </li>
          </ol>
        </section>
      </div>
    </>
  );
}
