// Testa a gravação de status no Supabase real usando um pedido TEMPORÁRIO (cliente @demo.evys.test), apagado ao final.
// Uso: npx tsx --env-file=.env.local scripts/test-status.ts
import { fetchOrder } from '../lib/dashboard/data';
import { applyOrderStatus } from '../lib/dashboard/status';
import { supabaseServer } from '../lib/supabase-server';

let failed = 0;
const ok = (n: string, c: boolean) => {
  console.log(c ? 'PASS' : 'FAIL', n);
  if (!c) failed++;
};

async function main() {
  const db = supabaseServer();
  const email = `tmp-${Date.now()}@demo.evys.test`;
  const c = await db.from('customers').insert({ name: 'Teste Status (temporário)', phone: '5511999990000', email }).select('id').single();
  if (c.error) throw new Error('não criou cliente: ' + c.error.message);
  const o = await db
    .from('orders')
    .insert({ customer_id: c.data.id, event_date: '2027-01-15', event_type: 'birthday', guests: 20 })
    .select('id')
    .single();
  if (o.error) throw new Error('não criou pedido: ' + o.error.message);
  const id = o.data.id as string;
  await db.from('quotes').insert({ order_id: id, total: 100, breakdown: { lines: [], entradaPct: 0.6 }, public_token: 'f'.repeat(32) });

  try {
    const read = async () => {
      const r = await fetchOrder(id);
      return r.ok ? r.data : null;
    };

    ok('começa em quote_sent', (await read())?.status === 'quote_sent');

    const won = await applyOrderStatus({ orderId: id, status: 'won' });
    const afterWon = await read();
    ok('fechar', won.ok && afterWon?.status === 'won' && afterWon.lossReason === null);

    const noReason = await applyOrderStatus({ orderId: id, status: 'lost' });
    ok('perdido sem motivo é recusado e não altera', !noReason.ok && (await read())?.status === 'won');

    const badReason = await applyOrderStatus({ orderId: id, status: 'lost', reason: 'inventado' });
    ok('motivo fora da lista é recusado', !badReason.ok);

    const lost = await applyOrderStatus({ orderId: id, status: 'lost', reason: 'price' });
    const afterLost = await read();
    ok('perdido com motivo', lost.ok && afterLost?.status === 'lost' && afterLost.lossReason === 'price');

    const reopened = await applyOrderStatus({ orderId: id, status: 'quote_sent' });
    const afterReopen = await read();
    ok('reabrir volta para quote_sent e limpa o motivo', reopened.ok && afterReopen?.status === 'quote_sent' && afterReopen.lossReason === null);

    ok('id inválido', !(await applyOrderStatus({ orderId: 'abc', status: 'won' })).ok);
    ok('pedido inexistente', !(await applyOrderStatus({ orderId: '00000000-0000-0000-0000-000000000000', status: 'won' })).ok);
    // @ts-expect-error status fora do contrato, só para provar a validação em tempo de execução
    ok('status inválido', !(await applyOrderStatus({ orderId: id, status: 'viewed' })).ok);
  } finally {
    await db.from('quotes').delete().eq('order_id', id);
    await db.from('orders').delete().eq('id', id);
    await db.from('customers').delete().eq('id', c.data.id);
    const left = await db.from('customers').select('id').eq('email', email);
    ok('limpeza: nada temporário sobrou', (left.data?.length ?? 1) === 0);
  }

  console.log(failed ? `\n${failed} falharam.` : '\nTodos passaram.');
  process.exit(failed ? 1 : 0);
}

main();
