import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateQuote, daysUntil, eventDateError } from './pricing.ts';

const trad = 'doces-tradicionais-brigadeiro';
const gourmet = 'doces-gourmet-oreo';

test('50 doces tradicionais: total, entrada de 60% e restante', () => {
  const q = calculateQuote([{ id: trad, qty: 50 }]);
  assert.equal(q.ok, true);
  assert.equal(q.total, 72.5);
  assert.equal(q.entrada, 43.5);
  assert.equal(q.restante, 29);
});

test('o mínimo de 50 doces vale para o pedido todo, somando tradicionais e gourmet', () => {
  assert.equal(calculateQuote([{ id: trad, qty: 30 }, { id: gourmet, qty: 20 }]).ok, true);
  const q = calculateQuote([{ id: trad, qty: 30 }, { id: gourmet, qty: 10 }]);
  assert.equal(q.ok, false);
  assert.match(q.errors[0], /faltam 10/);
});

test('parcial: não cobra o mínimo de 50 doces nem carrinho vazio, mas mantém as regras da linha', () => {
  assert.equal(calculateQuote([{ id: trad, qty: 10 }], { partial: true }).ok, true);
  assert.equal(calculateQuote([], { partial: true }).ok, true);
  assert.equal(calculateQuote([{ id: 'cupcake-cupcake', qty: 6 }], { partial: true }).ok, false);
});

test('cupcake exige massa, recheio e o mínimo de 12', () => {
  assert.equal(calculateQuote([{ id: 'cupcake-cupcake', qty: 12 }]).ok, false);
  const ok = calculateQuote([{ id: 'cupcake-cupcake', qty: 12, choice: { Massa: 'Chocolate', Recheio: 'Ninho' } }]);
  assert.equal(ok.ok, true);
  assert.equal(ok.total, 48);
  assert.equal(calculateQuote([{ id: 'cupcake-cupcake', qty: 6, choice: { Massa: 'Chocolate', Recheio: 'Ninho' } }]).ok, false);
});

test('bolo é por kg, a partir de 1,5 kg, em passos de 0,5', () => {
  const id = 'bolos-de-massa-baunilha-bolo-baunilha-maracuja';
  assert.equal(calculateQuote([{ id, qty: 1.5 }]).total, 135);
  assert.equal(calculateQuote([{ id, qty: 1 }]).ok, false);
  assert.equal(calculateQuote([{ id, qty: 1.7 }]).ok, false);
});

test('item desconhecido ou carrinho vazio é inválido', () => {
  assert.equal(calculateQuote([{ id: 'nao-existe', qty: 10 }]).ok, false);
  assert.equal(calculateQuote([]).ok, false);
});

test('antecedência mínima de 7 dias', () => {
  assert.equal(daysUntil('2026-12-14', '2026-12-07'), 7);
  assert.equal(eventDateError('2026-12-14', '2026-12-07'), null);
  assert.match(eventDateError('2026-12-13', '2026-12-07') ?? '', /7 dias/);
  assert.equal(eventDateError('', '2026-12-07'), 'Informe a data do evento.');
});
