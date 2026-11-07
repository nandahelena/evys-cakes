'use client';

import type { DayCellMountArg, EventClickArg, EventInput } from '@fullcalendar/core';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { formatDateBR } from '@/lib/dashboard/logic';
import { brl, EVENT_TYPE_LABEL } from '@/lib/labels';
import { ContactButton } from './ContactButton';
import type { CalOrder } from './OrdersCalendar';
import { StatusBadge } from './StatusBadge';

// Cores dos tokens da marca (as mesmas das etiquetas de status), aplicadas como variáveis CSS.
const COLORS: Record<CalOrder['status'], { bg: string; border: string; text: string }> = {
  quote_sent: { bg: 'var(--superficie)', border: 'var(--primaria)', text: 'var(--primaria-escura)' },
  viewed: { bg: 'var(--urg-fundo)', border: 'var(--urg)', text: 'var(--urg-texto)' },
  won: { bg: 'var(--ok-fundo)', border: 'var(--ok)', text: 'var(--ok)' },
  lost: { bg: '#efe6ea', border: '#9a7d8c', text: '#5f4153' },
};

const MOBILE = '(max-width: 699px)';
const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function CalendarView({ orders }: { orders: CalOrder[] }) {
  const calRef = useRef<FullCalendar>(null);
  const [selected, setSelected] = useState<CalOrder | null>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches);

  // No celular, a lista do mês é mais legível que a grade; troca a visão se a janela mudar de tamanho.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const onChange = () => {
      setMobile(mq.matches);
      calRef.current?.getApi().changeView(mq.matches ? 'listMonth' : 'dayGridMonth');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const byId = useMemo(() => new Map(orders.map((o) => [o.id, o])), [orders]);

  const events = useMemo<EventInput[]>(
    () =>
      orders.map((o) => ({
        id: o.id,
        title: `${o.name.split(' ')[0]} · ${EVENT_TYPE_LABEL[o.eventType]}`,
        start: o.eventDate,
        allDay: true,
        backgroundColor: COLORS[o.status].bg,
        borderColor: COLORS[o.status].border,
        textColor: COLORS[o.status].text,
        classNames: [`fc-st-${o.status}`],
      })),
    [orders],
  );

  // Dias com 2 ou mais eventos que ainda vão acontecer (pedidos perdidos não contam).
  const busyDays = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders) if (o.status !== 'lost') counts.set(o.eventDate, (counts.get(o.eventDate) ?? 0) + 1);
    return new Set([...counts].filter(([, n]) => n >= 2).map(([day]) => day));
  }, [orders]);

  const onEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    setSelected(byId.get(info.event.id) ?? null);
  };

  return (
    <>
      <div className="cal card">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, listPlugin]}
          locale={ptBrLocale}
          initialView={mobile ? 'listMonth' : 'dayGridMonth'}
          headerToolbar={
            mobile
              ? { left: 'prev,next', center: 'title', right: 'dayGridMonth,listMonth' }
              : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' }
          }
          views={{ dayGridMonth: { buttonText: 'Mês' }, listMonth: { buttonText: 'Lista' } }}
          events={events}
          eventClick={onEventClick}
          dayMaxEvents={3}
          height="auto"
          fixedWeekCount={false}
          noEventsContent="Nenhum evento neste mês."
          dayCellClassNames={(arg: DayCellMountArg | { date: Date }) => (busyDays.has(ymd(arg.date)) ? ['cal-multi'] : [])}
        />
      </div>

      <ul className="cal-legend" aria-label="Legenda do calendário">
        {(Object.keys(COLORS) as CalOrder['status'][]).map((s) => (
          <li key={s}>
            <StatusBadge status={s} />
          </li>
        ))}
        <li className="cal-legend-multi">
          <i aria-hidden="true" /> Dia com 2 ou mais eventos
        </li>
      </ul>

      {selected && (
        <Dialog title={selected.name} onClose={() => setSelected(null)}>
          <dl className="cal-sum">
            <div>
              <dt>Data</dt>
              <dd>{formatDateBR(selected.eventDate)}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{EVENT_TYPE_LABEL[selected.eventType]}</dd>
            </div>
            <div>
              <dt>Convidados</dt>
              <dd>{selected.guests}</dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{selected.total === null ? '—' : brl(selected.total)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={selected.status} />
              </dd>
            </div>
          </dl>
          <div className="dlg-actions">
            <button type="button" className="btn btn-s btn-sm" onClick={() => setSelected(null)}>
              Fechar
            </button>
            <Link href={`/dashboard/orders/${selected.id}`} className="btn btn-s btn-sm">
              Ver detalhes
            </Link>
            <ContactButton
              customer={{ name: selected.name, phone: selected.phone, email: null }}
              eventType={selected.eventType}
              eventDate={selected.eventDate}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
