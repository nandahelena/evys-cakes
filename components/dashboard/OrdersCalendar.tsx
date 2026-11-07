'use client';

import dynamic from 'next/dynamic';

// O FullCalendar mexe no DOM e no tamanho da janela: carrega só no navegador (sem SSR).
const CalendarView = dynamic(() => import('./CalendarView'), {
  ssr: false,
  loading: () => <p className="small">Carregando calendário…</p>,
});

export type CalOrder = {
  id: string;
  name: string;
  phone: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'other';
  eventDate: string; // YYYY-MM-DD
  guests: number;
  status: 'quote_sent' | 'viewed' | 'won' | 'lost';
  total: number | null;
};

export function OrdersCalendar({ orders }: { orders: CalOrder[] }) {
  return <CalendarView orders={orders} />;
}
