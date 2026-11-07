'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { markViewed } from '@/app/actions';
import { clearCart } from '@/lib/cart';
import { waLink } from '@/lib/whatsapp';
import { Icon } from './Icon';

const here = () => window.location.href.split('?')[0];
const openWhatsApp = (text: string) => window.open(waLink(text), '_blank', 'noopener');

export function ViewTracker({ token }: { token: string }) {
  useEffect(() => {
    markViewed(token);
  }, [token]);
  return null;
}

export function NovoCard({ code }: { code: string }) {
  useEffect(() => {
    clearCart(); // o orçamento foi gerado: esvazia o carrinho deste navegador
  }, []);
  return (
    <div className="novo">
      <b>Seu orçamento está pronto!</b>
      Envie para a Evy no WhatsApp para ela já acompanhar o seu pedido.
      <br />
      <button className="btn btn-p btn-sm" onClick={() => openWhatsApp(`Oi, Evy! Acabei de gerar o orçamento ${code} pelo site.\n${here()}`)}>
        <Icon name="i-chat" />
        Enviar para a Evy
      </button>
    </div>
  );
}

export function TalkButton({ code }: { code: string }) {
  return (
    <button
      className="btn btn-s"
      style={{ width: '100%', marginTop: 16 }}
      onClick={() => openWhatsApp(`Oi, Evy! Tenho uma dúvida sobre o orçamento ${code}.\n${here()}`)}
    >
      <Icon name="i-chat" />
      Tirar dúvida ou pedir ajuste
    </button>
  );
}

export function Dock({ code, dateLabel, entrada, expired }: { code: string; dateLabel: string; entrada: string; expired: boolean }) {
  const [toast, setToast] = useState('');

  const share = async () => {
    const url = here();
    try {
      if (navigator.share) await navigator.share({ title: 'Orçamento Evys Cakes', url });
      else {
        await navigator.clipboard.writeText(url);
        setToast('Link copiado');
        setTimeout(() => setToast(''), 2500);
      }
    } catch {
      // cancelar o compartilhamento não é erro
    }
  };

  return (
    <div className="dock">
      <div className="t">
        <small>Entrada</small>
        <b>{entrada}</b>
      </div>
      {expired ? (
        <Link className="btn btn-p" href="/pedido">
          Fazer novo pedido
        </Link>
      ) : (
        <button
          className="btn btn-p"
          onClick={() => openWhatsApp(`Oi, Evy! Quero reservar a data ${dateLabel} do orçamento ${code} (entrada de ${entrada}). Pode me passar o Pix?\n${here()}`)}
        >
          <Icon name="i-cal" />
          Reservar data
        </button>
      )}
      <button className="sq" aria-label="Compartilhar orçamento" onClick={share}>
        <Icon name="i-share" />
      </button>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
