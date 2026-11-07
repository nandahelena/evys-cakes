'use client';

import { useState } from 'react';

/** Mostra o link público do orçamento e copia a URL completa (NEXT_PUBLIC_SITE_URL, ou o endereço atual). */
export function CopyLink({ token }: { token: string }) {
  const [msg, setMsg] = useState('');
  const path = `/quote/${token}`;

  const copy = async () => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, '');
    try {
      await navigator.clipboard.writeText(`${base}${path}`);
      setMsg('Link copiado!');
    } catch {
      setMsg('Não consegui copiar. Selecione o link e copie manualmente.');
    }
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div className="copy-link">
      <a href={path} target="_blank" rel="noopener noreferrer" className="copy-url">
        {path.slice(0, 18)}…
      </a>
      <button type="button" className="btn btn-s btn-sm" onClick={copy}>
        Copiar link
      </button>
      <span className="copy-msg" role="status" aria-live="polite">
        {msg}
      </span>
    </div>
  );
}
