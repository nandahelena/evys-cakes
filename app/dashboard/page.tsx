import { connection } from 'next/server';
import { Suspense } from 'react';
import { AttentionList } from '@/components/dashboard/AttentionList';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FilterChips } from '@/components/dashboard/FilterChips';
import { OrdersList } from '@/components/dashboard/OrdersList';
import { fetchOrders } from '@/lib/dashboard/data';
import { applyFilter, computeStats, parseFilter, staleOrders, type Filter } from '@/lib/dashboard/logic';

export default function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  return (
    <>
      <h1 className="dash-title">Pedidos</h1>
      <Suspense fallback={<p className="small">Carregando pedidos…</p>}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Orders({ searchParams }: Pick<PageProps<'/dashboard'>, 'searchParams'>) {
  await connection(); // lê o banco e a hora atual a cada acesso
  const filter = parseFilter((await searchParams).f);
  const result = await fetchOrders();

  if (!result.ok) {
    return (
      <p className="err" role="alert">
        Não foi possível carregar os pedidos agora. Tente atualizar a página em instantes.
      </p>
    );
  }

  const now = Date.now();
  const all = result.data;
  const counts = Object.fromEntries(
    (['todos', 'parados', 'fechados', 'perdidos'] as Filter[]).map((f) => [f, applyFilter(all, f, now).length]),
  ) as Record<Filter, number>;

  return (
    <>
      <StatsCards stats={computeStats(all, now)} />
      <AttentionList orders={staleOrders(all, now)} now={now} />
      <FilterChips current={filter} counts={counts} />
      <OrdersList orders={applyFilter(all, filter, now)} now={now} filter={filter} />
    </>
  );
}
