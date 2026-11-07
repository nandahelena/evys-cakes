import { applyFilter, computeStats, daysSince, followUpMessage, formatDateBR, formatPhone, isStale, parseFilter, sinceLabel, staleOrders, whatsappUrl, DAY } from '../lib/dashboard/logic';
import type { DashOrder } from '../lib/dashboard/types';

let failed = 0;
const ok = (n: string, c: boolean) => {
  console.log(c ? 'PASS' : 'FAIL', n);
  if (!c) failed++;
};

const NOW = Date.parse('2026-11-07T15:00:00Z');
const mk = (over: Partial<DashOrder> & { sentDaysAgo?: number } = {}): DashOrder => ({
  id: 'x',
  eventDate: '2026-12-20',
  eventType: 'birthday',
  guests: 40,
  decor: null,
  venue: null,
  notes: null,
  status: 'quote_sent',
  lossReason: null,
  createdAt: '2026-11-01T10:00:00Z',
  customer: { name: 'Ana Souza', phone: '5511999990001', email: null },
  quote: {
    total: 300,
    lines: [],
    entradaPct: 0.6,
    token: 'a'.repeat(32),
    sentAt: new Date(NOW - (over.sentDaysAgo ?? 5) * DAY).toISOString(),
    viewedAt: null,
  },
  ...over,
});

ok('parado: quote_sent há 5 dias', isStale(mk(), NOW));
ok('parado: viewed há 3 dias', isStale(mk({ status: 'viewed', sentDaysAgo: 3 }), NOW));
ok('não parado: exatamente 2 dias', !isStale(mk({ sentDaysAgo: 2 }), NOW));
ok('não parado: há 1 dia', !isStale(mk({ sentDaysAgo: 1 }), NOW));
ok('não parado: won/lost', !isStale(mk({ status: 'won' }), NOW) && !isStale(mk({ status: 'lost' }), NOW));
ok('não parado: sem orçamento', !isStale(mk({ quote: null }), NOW));

const list = [
  mk({ id: 'a', sentDaysAgo: 3 }),
  mk({ id: 'b', sentDaysAgo: 9 }),
  mk({ id: 'c', status: 'won' }),
  mk({ id: 'd', status: 'lost', lossReason: 'price' }),
  mk({ id: 'e', sentDaysAgo: 1 }),
];
ok('parados do mais antigo ao mais recente', staleOrders(list, NOW).map((o) => o.id).join() === 'b,a');
ok(
  'filtros',
  applyFilter(list, 'parados', NOW).length === 2 &&
    applyFilter(list, 'fechados', NOW).length === 1 &&
    applyFilter(list, 'perdidos', NOW).length === 1 &&
    applyFilter(list, 'todos', NOW).length === 5,
);
ok('parseFilter inválido -> todos', parseFilter('xyz') === 'todos' && parseFilter(undefined) === 'todos' && parseFilter(['parados', 'x']) === 'parados');

ok(
  'daysSince/sinceLabel',
  daysSince(new Date(NOW - 3.5 * DAY).toISOString(), NOW) === 3 && sinceLabel(0) === 'hoje' && sinceLabel(1) === 'há 1 dia' && sinceLabel(4) === 'há 4 dias',
);
ok('data dd/MM/yyyy', formatDateBR('2026-12-05') === '05/12/2026');
ok(
  'telefone formatado (com e sem 55, fixo e celular)',
  formatPhone('5511999990001') === '(11) 99999-0001' &&
    formatPhone('11900000000') === '(11) 90000-0000' &&
    formatPhone('1133334444') === '(11) 3333-4444' &&
    formatPhone('abc') === 'abc',
);
ok('wa.me com 55 e texto codificado', whatsappUrl('11999990001', 'Oi, tudo bem?') === 'https://wa.me/5511999990001?text=Oi%2C%20tudo%20bem%3F');

const birthday = followUpMessage(mk(), 'https://x/quote/abc');
ok('mensagem padrão: nome, tipo, sem link', birthday.startsWith('Oi Ana!') && birthday.includes('aniversário') && !birthday.includes('https://'));
const wedding = followUpMessage(mk({ eventType: 'wedding' }), 'https://x/quote/abc');
ok('mensagem de casamento: acolhedora e com link', wedding.includes('casamento') && wedding.includes('mostrar mais do meu trabalho') && wedding.includes('https://x/quote/abc'));

const s = computeStats(list, NOW);
ok('stats', s.sent === 5 && s.won === 1 && s.lost === 1 && s.conversionPct === 20 && s.followUps === 2 && s.topLossReason?.reason === 'price');
ok('stats vazio', computeStats([], NOW).conversionPct === null && computeStats([], NOW).topLossReason === null);

console.log(failed ? `\n${failed} falharam.` : '\nTodos passaram.');
process.exit(failed ? 1 : 0);
