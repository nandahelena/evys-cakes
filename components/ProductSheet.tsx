'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { readCart, replaceLines } from '@/lib/cart';
import { BY_ID, CATEGORY_NOTE, DOCES_MIN, categoryMeta } from '@/lib/catalog';
import { brl } from '@/lib/labels';
import { calculateQuote } from '@/lib/pricing';
import { Icon } from './Icon';
import { Doodles } from './Sprite';
import { Stepper } from './Stepper';

// Folha de detalhes de um item do cardápio (estilo iFood): foto, descrição, sabores com quantidade e botão de adicionar.
export function ProductSheet({ category, onClose }: { category: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (category && !d.open) d.showModal();
    else if (!category && d.open) d.close();
  }, [category]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={category ?? 'Detalhes do item'}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      {category && <SheetBody key={category} category={category} onClose={() => ref.current?.close()} />}
    </dialog>
  );
}

function SheetBody({ category, onClose }: { category: string; onClose: () => void }) {
  const m = categoryMeta(category);
  const [existing] = useState(readCart);
  const mine = existing.filter((l) => m.items.some((p) => p.id === l.id));
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(mine.map((l) => [l.id, l.qty])));
  const [choice, setChoice] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(mine.filter((l) => l.choice).map((l) => [l.id, l.choice!])),
  );

  const draft = m.items.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({ id: p.id, qty: qty[p.id], choice: choice[p.id] }));
  const quote = calculateQuote(draft, { partial: true });
  const isDoces = !!m.items[0].minGroup;
  const docesOutside = existing.filter((l) => BY_ID.get(l.id)?.minGroup && !m.items.some((p) => p.id === l.id)).reduce((s, l) => s + l.qty, 0);
  const docesNow = docesOutside + draft.reduce((s, l) => s + l.qty, 0);

  const save = () => {
    replaceLines(m.items.map((p) => p.id), draft);
    onClose();
  };

  return (
    <>
      <div className="sheet-photo">
        {m.photo ? (
          <Image src={m.photo} alt="" fill sizes="560px" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="noimg">
            <Doodles className="bg" />
            <Icon name="i-topper" />
          </div>
        )}
        <button type="button" className="sheet-x" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="sheet-body">
        <h2>{category}</h2>
        <p className="lead" style={{ margin: '6px 0 10px' }}>{m.desc}</p>
        <div className="tags">
          <span className="tag-s">a partir de {brl(m.from)} {m.unit === 'kg' ? 'o kg' : 'cada'}</span>
          <span className="tag-s">mínimo: {m.min}</span>
        </div>
        {CATEGORY_NOTE[category] && <p className="small" style={{ textAlign: 'left', margin: '0 0 6px' }}>{CATEGORY_NOTE[category]}</p>}

        {m.items[0].options && (
          <div className="opts" style={{ marginTop: 12 }}>
            {m.items[0].options.map((o) => (
              <label key={o.name}>
                {o.name}
                <select
                  value={choice[m.items[0].id]?.[o.name] ?? ''}
                  onChange={(e) => setChoice((s) => ({ ...s, [m.items[0].id]: { ...s[m.items[0].id], [o.name]: e.target.value } }))}
                >
                  <option value="">Escolher</option>
                  {o.choices.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}

        <div className="sec" style={{ marginTop: 18 }}>{m.items.length > 1 ? 'Escolha os sabores' : 'Quantidade'}</div>
        {m.items.map((p) => (
          <div className="prow" key={p.id}>
            <div>
              <b>{m.items.length > 1 ? p.name : category}</b>
              <small>{brl(p.price)} {p.unit === 'kg' ? 'o kg' : 'cada'}</small>
            </div>
            <Stepper p={p} q={qty[p.id] ?? 0} onChange={(n) => setQty((s) => ({ ...s, [p.id]: n }))} />
          </div>
        ))}

        {isDoces && (
          <p className="hint" style={{ marginTop: 12 }}>
            Mínimo de {DOCES_MIN} doces no orçamento todo, somando tradicionais e gourmet. Hoje você tem {docesNow}.
          </p>
        )}
        {draft.length > 0 && quote.errors.length > 0 && <p className="hint" role="status" style={{ marginTop: 8 }}>{quote.errors.slice(0, 2).join(' ')}</p>}
      </div>

      <div className="sheet-foot">
        {draft.length === 0 ? (
          mine.length > 0 ? (
            <button type="button" className="btn btn-s" onClick={save}>Remover do orçamento</button>
          ) : (
            <button type="button" className="btn btn-p" disabled>Escolha uma quantidade</button>
          )
        ) : (
          <button type="button" className="btn btn-p" disabled={!quote.ok} onClick={save}>
            {mine.length > 0 ? 'Atualizar orçamento' : 'Adicionar ao orçamento'} · {brl(quote.total)}
          </button>
        )}
      </div>
    </>
  );
}
