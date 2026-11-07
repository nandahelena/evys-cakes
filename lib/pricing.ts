import { ANTECEDENCIA_DIAS, BY_ID, DOCES_MIN, ENTRADA_PCT } from './catalog.ts';
import type { CartLine } from './types.ts';

export type QuoteLine = {
  id: string;
  name: string;
  qty: number;
  unit: 'un' | 'kg';
  unitPrice: number;
  subtotal: number;
  choice?: string;
  photo?: string;
};

const MAX_QTY = 5000;
const fmtQty = (n: number) => String(n).replace('.', ',');

// Calcula o orçamento a partir dos itens do carrinho, com os preços fixos do cardápio.
// `errors` vazio significa orçamento válido (mínimos e escolhas respeitados).
// `partial` ignora as regras do pedido inteiro (mínimo de doces somados, carrinho vazio): serve para validar uma parte do carrinho.
export function calculateQuote(items: CartLine[], opts: { partial?: boolean } = {}) {
  const errors: string[] = [];
  const lines: QuoteLine[] = [];
  let totalCents = 0;
  let doces = 0;

  for (const it of items) {
    if (!(it.qty > 0)) continue;
    const p = BY_ID.get(it.id);
    if (!p) {
      errors.push('Item inexistente no cardápio.');
      continue;
    }
    const okQty = it.qty <= MAX_QTY && (p.unit === 'kg' ? Number.isInteger(it.qty * 2) : Number.isInteger(it.qty));
    if (!okQty) {
      errors.push(`Quantidade inválida: ${p.name}.`);
      continue;
    }

    const picked: string[] = [];
    for (const opt of p.options ?? []) {
      const v = it.choice?.[opt.name];
      if (!v || !opt.choices.includes(v)) errors.push(`Escolha ${opt.name.toLowerCase()} de ${p.name.toLowerCase()}.`);
      else picked.push(`${opt.name.toLowerCase()} ${v.toLowerCase()}`);
    }

    if (p.minGroup === 'doces') doces += it.qty;
    else if (it.qty < p.min) errors.push(`${p.name}: mínimo de ${fmtQty(p.min)} ${p.unit}.`);

    const subtotalCents = Math.round(p.price * 100 * it.qty);
    totalCents += subtotalCents;
    lines.push({
      id: p.id,
      name: p.name,
      qty: it.qty,
      unit: p.unit,
      unitPrice: p.price,
      subtotal: subtotalCents / 100,
      choice: picked.length ? picked.join(' · ') : undefined,
      photo: p.photo,
    });
  }

  if (!opts.partial) {
    if (doces > 0 && doces < DOCES_MIN) errors.push(`Doces: mínimo de ${DOCES_MIN} no pedido todo (faltam ${DOCES_MIN - doces}).`);
    if (lines.length === 0) errors.push('Escolha ao menos um item.');
  }

  const entradaCents = Math.round(totalCents * ENTRADA_PCT);
  return {
    ok: errors.length === 0,
    errors,
    lines,
    total: totalCents / 100,
    entrada: entradaCents / 100,
    restante: (totalCents - entradaCents) / 100,
    breakdown: { lines, entradaPct: ENTRADA_PCT },
  };
}

export const todayInSaoPaulo = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

export function daysUntil(isoDate: string, todayISO: string): number {
  return Math.round((Date.parse(`${isoDate}T00:00:00Z`) - Date.parse(`${todayISO}T00:00:00Z`)) / 86_400_000);
}

export function eventDateError(isoDate: string, todayISO: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || Number.isNaN(Date.parse(isoDate))) return 'Informe a data do evento.';
  return daysUntil(isoDate, todayISO) < ANTECEDENCIA_DIAS
    ? `Pedimos pelo menos ${ANTECEDENCIA_DIAS} dias de antecedência. Para datas mais próximas, fale com a Evy.`
    : null;
}
