import type { Product } from './catalog.ts';

// Regras do botão +/−: o primeiro "+" já vai ao mínimo da linha; abaixo do mínimo, o "−" zera.
export const nextQty = (p: Product, q: number) => (q === 0 ? (p.minGroup ? p.step : p.min) : q + p.step);

export function prevQty(p: Product, q: number) {
  const n = q - p.step;
  return p.minGroup ? Math.max(n, 0) : n < p.min ? 0 : n;
}

export const fmtQty = (p: Product, q: number) => (p.unit === 'kg' ? `${String(q).replace('.', ',')} kg` : `${q} un`);
