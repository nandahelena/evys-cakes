'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { BY_ID, CATEGORIES, categoryMeta } from '@/lib/catalog';
import { brl } from '@/lib/labels';
import { calculateQuote } from '@/lib/pricing';
import { Icon } from './Icon';
import { ProductSheet } from './ProductSheet';
import { Doodles } from './Sprite';

export function Cardapio() {
  const { lines } = useCart();
  const [open, setOpen] = useState<string | null>(null);
  const valid = lines.filter((l) => BY_ID.has(l.id));
  const total = calculateQuote(valid, { partial: true }).total;

  return (
    <>
      <div className="w menu-page">
        <div className="menu-head">
          <div className="eyebrow"><Icon name="i-menu" />Cardápio 2026</div>
          <h1>Escolha seus doces</h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            Toque em um item para ver os detalhes e adicionar ao seu orçamento. O valor aparece na hora.
          </p>
        </div>

        <div className="mgrid">
          {CATEGORIES.map((c) => {
            const m = categoryMeta(c);
            const count = valid.filter((l) => m.items.some((p) => p.id === l.id)).reduce((s, l) => s + l.qty, 0);
            return (
              <button key={c} id={m.id} type="button" className="pcard" onClick={() => setOpen(c)}>
                <span className={`pic ${m.photo ? '' : 'noimg'}`}>
                  {m.photo ? (
                    <Image src={m.photo} alt="" fill sizes="(max-width: 600px) 100vw, 300px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Doodles className="bg" />
                      <Icon name="i-topper" />
                    </>
                  )}
                  {count > 0 && <span className="badge-n">{String(count).replace('.', ',')} {m.unit === 'kg' ? 'kg' : 'un'} no orçamento</span>}
                  <span className="add" aria-hidden="true">+</span>
                </span>
                <span className="info">
                  <h3>{c}</h3>
                  <span className="desc">{m.desc}</span>
                  <span className="meta">
                    <b>a partir de {brl(m.from)}</b>
                    <small>mín. {m.min}</small>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="small" style={{ marginTop: 28 }}>Casamento, bolo decorado ou algo fora do cardápio? Use o botão de WhatsApp para falar com a Evy.</p>
      </div>

      <ProductSheet category={open} onClose={() => setOpen(null)} />

      {valid.length > 0 && (
        <div className="dock wide">
          <div className="t">
            <small>{valid.length} {valid.length === 1 ? 'item' : 'itens'} no orçamento</small>
            <b>{brl(total)}</b>
          </div>
          <Link className="btn btn-p" href="/pedido">Ver meu orçamento</Link>
        </div>
      )}
    </>
  );
}
