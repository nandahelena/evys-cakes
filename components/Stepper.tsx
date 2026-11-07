'use client';

import type { Product } from '@/lib/catalog';
import { nextQty, prevQty } from '@/lib/qty';

export function Stepper({ p, q, onChange }: { p: Product; q: number; onChange: (n: number) => void }) {
  return (
    <div className="stepper">
      <button type="button" aria-label={`Diminuir ${p.name}`} disabled={q === 0} onClick={() => onChange(prevQty(p, q))}>
        −
      </button>
      <input
        type="number"
        inputMode="decimal"
        aria-label={`Quantidade de ${p.name}${p.unit === 'kg' ? ' em kg' : ''}`}
        min={0}
        step={p.unit === 'kg' ? 0.5 : 1}
        placeholder="0"
        value={q || ''}
        onChange={(e) => {
          const n = Number.parseFloat(e.target.value);
          onChange(Number.isFinite(n) && n > 0 ? n : 0);
        }}
      />
      <button type="button" aria-label={`Aumentar ${p.name}`} onClick={() => onChange(nextQty(p, q))}>
        +
      </button>
    </div>
  );
}
