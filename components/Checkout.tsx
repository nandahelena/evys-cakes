'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { createOrder, type OrderState } from '@/app/actions';
import { setLine, useCart } from '@/lib/cart';
import { BY_ID } from '@/lib/catalog';
import { brl } from '@/lib/labels';
import { calculateQuote, eventDateError, todayInSaoPaulo } from '@/lib/pricing';
import { waLink } from '@/lib/whatsapp';
import { Icon } from './Icon';
import { Stepper } from './Stepper';

// Revisão do orçamento (itens do carrinho) + dados da cliente e do evento. O servidor recalcula tudo.
export function Checkout() {
  const { lines: raw, ready } = useCart();
  const [state, action, pending] = useActionState(createOrder, {} as OrderState);
  const [dateErr, setDateErr] = useState<string | null>(null);

  const lines = useMemo(() => raw.filter((l) => BY_ID.has(l.id) && l.qty > 0), [raw]);
  const quote = useMemo(() => calculateQuote(lines), [lines]);
  const v = state.values ?? {};
  const shownError = state.error ?? dateErr;

  if (!ready) return <div className="pw"><p className="small" style={{ padding: 40 }}>Carregando o seu orçamento…</p></div>;

  if (lines.length === 0) {
    return (
      <div className="pw">
        <div className="card" style={{ marginTop: 28, textAlign: 'center' }}>
          <Icon name="i-menu" className="big" />
          <h1 style={{ fontSize: 28, margin: '10px 0 6px' }}>Seu orçamento está vazio</h1>
          <p className="lead" style={{ margin: '0 auto 18px' }}>Escolha alguns doces no cardápio para ver o valor na hora.</p>
          <Link className="btn btn-p" href="/cardapio">Ver o cardápio</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="pw">
      <h1>Seu orçamento</h1>
      <p className="lead" style={{ margin: '0 0 6px' }}>Confira os itens, conte do seu evento e gere o orçamento.</p>
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      <section className="fs">
        <h2>Itens</h2>
        {quote.lines.map((l) => {
          const p = BY_ID.get(l.id)!;
          const mine = lines.find((x) => x.id === l.id)!;
          return (
            <div className="cl" key={l.id}>
              <span className={`th ${l.photo ? '' : 'ph-icon'}`} style={{ width: 52, height: 52 }}>
                {l.photo ? <Image src={l.photo} alt="" fill sizes="52px" style={{ objectFit: 'cover' }} /> : <Icon name="i-topper" />}
              </span>
              <div>
                <b>{l.name}</b>
                <small>{l.choice ? `${l.choice} · ` : ''}{brl(l.unitPrice)} {l.unit === 'kg' ? 'o kg' : 'cada'}</small>
              </div>
              <div className="v">{brl(l.subtotal)}</div>
              <div className="ctrl">
                <Stepper p={p} q={l.qty} onChange={(n) => setLine({ id: l.id, qty: n, choice: mine.choice })} />
                <button type="button" className="rm" onClick={() => setLine({ id: l.id, qty: 0 })}>Remover</button>
              </div>
            </div>
          );
        })}
        <Link className="btn btn-s btn-sm" href="/cardapio" style={{ marginTop: 14 }}>+ Adicionar mais itens</Link>
        {quote.errors.length > 0 && (
          <div className="hint" role="status" style={{ marginTop: 14 }}>
            {quote.errors.map((e) => <div key={e}>{e}</div>)}
          </div>
        )}
      </section>

      <fieldset className="fs" style={{ border: '1px solid var(--linha)' }}>
        <h2>Seus dados</h2>
        <label className="field">
          Nome
          <input name="name" autoComplete="name" required maxLength={80} defaultValue={v.name} />
        </label>
        <label className="field">
          WhatsApp
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="(11) 90000-0000" defaultValue={v.phone} />
        </label>
      </fieldset>

      <fieldset className="fs" style={{ border: '1px solid var(--linha)' }}>
        <h2>Seu evento</h2>
        <div className="row2">
          <label className="field">
            Data do evento
            <input
              name="eventDate"
              type="date"
              required
              defaultValue={v.eventDate}
              onChange={(e) => setDateErr(e.target.value ? eventDateError(e.target.value, todayInSaoPaulo()) : null)}
            />
          </label>
          <label className="field">
            Tipo de evento
            <select name="eventType" required defaultValue={v.eventType || 'birthday'}>
              <option value="birthday">Aniversário</option>
              <option value="wedding">Casamento</option>
              <option value="corporate">Evento corporativo</option>
              <option value="other">Outro</option>
            </select>
          </label>
        </div>
        <div className="row2">
          <label className="field">
            Nº de convidados
            <input name="guests" type="number" inputMode="numeric" min={1} max={5000} required defaultValue={v.guests} />
          </label>
          <label className="field">
            Local do evento <small>opcional</small>
            <input name="venue" maxLength={200} defaultValue={v.venue} />
          </label>
        </div>
        <label className="field">
          Estilo e decoração <small>opcional</small>
          <textarea name="decor" maxLength={600} placeholder="Cores, tema, estilo da mesa…" defaultValue={v.decor} />
        </label>
        <label className="field">
          Observações <small>opcional</small>
          <textarea name="notes" maxLength={600} placeholder="Sabores misturados, alergias, horário de retirada…" defaultValue={v.notes} />
        </label>
        {shownError && (
          <p className="err" role="alert">
            {shownError}{' '}
            {shownError.includes('fale com a Evy') && (
              <a href={waLink('Oi, Evy! Preciso de uma encomenda para uma data próxima.')} target="_blank" rel="noopener noreferrer">
                Chamar no WhatsApp
              </a>
            )}
          </p>
        )}
      </fieldset>

      <div className="dock wide">
        <div className="t">
          <small>Total · entrada {brl(quote.entrada)}</small>
          <b>{brl(quote.total)}</b>
        </div>
        <button className="btn btn-p" type="submit" disabled={pending || !quote.ok || !!dateErr}>
          {pending ? 'Gerando…' : 'Gerar meu orçamento'}
        </button>
      </div>
    </form>
  );
}
