import { connection } from 'next/server';
import { Suspense } from 'react';
import { OrdersCalendar, type CalOrder } from '@/components/dashboard/OrdersCalendar';
import { fetchOrders } from '@/lib/dashboard/data';

export default function CalendarPage() {
  return (
    <>
      <h1 className="dash-title">Calendário</h1>
      <Suspense fallback={<p className="small">Carregando calendário…</p>}>
        <Calendar />
      </Suspense>
    </>
  );
}

async function Calendar() {
  await connection();
  const result = await fetchOrders();

  if (!result.ok) {
    return (
      <p className="err" role="alert">
        Não foi possível carregar o calendário agora. Tente atualizar a página em instantes.
      </p>
    );
  }

  const orders: CalOrder[] = result.data.map((o) => ({
    id: o.id,
    name: o.customer.name,
    phone: o.customer.phone,
    eventType: o.eventType,
    eventDate: o.eventDate,
    guests: o.guests,
    status: o.status,
    total: o.quote ? o.quote.total : null,
  }));

  return <OrdersCalendar orders={orders} />;
}
