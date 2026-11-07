'use client';

import { useState, useTransition } from 'react';
import { setOrderStatus } from '@/app/dashboard/actions';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { LOSS_REASON_LABEL } from '@/lib/labels';
import type { OrderStatus } from '@/lib/dashboard/types';

type Mode = 'won' | 'lost' | 'reopen';

type Props = { orderId: string; customerName: string; status: OrderStatus };

/** Botões de status (fechar, perder, reabrir) com confirmação leve e aviso depois de salvar. */
export function OrderActions({ orderId, customerName, status }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const toast = useToast();

  const close = () => {
    setMode(null);
    setReason('');
    setError('');
  };

  const confirm = () => {
    if (!mode) return;
    if (mode === 'lost' && !reason) {
      setError('Escolha o motivo da perda.');
      return;
    }
    setError('');
    start(async () => {
      const res = await setOrderStatus({
        orderId,
        status: mode === 'reopen' ? 'quote_sent' : mode,
        reason: mode === 'lost' ? reason : undefined,
      });
      if (res.ok) {
        toast(res.message);
        close();
      } else {
        setError(res.error);
      }
    });
  };

  const open = status === 'quote_sent' || status === 'viewed';

  return (
    <>
      <div className="act">
        {open ? (
          <>
            <button type="button" className="btn btn-s btn-sm" onClick={() => setMode('won')}>
              Marcar como fechado
            </button>
            <button type="button" className="btn btn-s btn-sm" onClick={() => setMode('lost')}>
              Marcar como perdido
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-s btn-sm" onClick={() => setMode('reopen')}>
            Reabrir pedido
          </button>
        )}
      </div>

      {mode && (
        <Dialog
          title={mode === 'won' ? 'Marcar como fechado?' : mode === 'lost' ? 'Marcar como perdido?' : 'Reabrir pedido?'}
          onClose={() => !pending && close()}
        >
          <p>
            {mode === 'won' && `O pedido de ${customerName} vai aparecer como fechado.`}
            {mode === 'lost' && `Qual foi o motivo? Isso ajuda a entender por que ${customerName} não fechou.`}
            {mode === 'reopen' && `O pedido de ${customerName} volta para "Orçamento enviado" e o motivo da perda é apagado.`}
          </p>

          {mode === 'lost' && (
            <label className="field">
              Motivo da perda
              <select value={reason} onChange={(e) => setReason(e.target.value)} autoFocus>
                <option value="">Escolha um motivo</option>
                {Object.entries(LOSS_REASON_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && (
            <p className="err" role="alert">
              {error}
            </p>
          )}

          <div className="dlg-actions">
            <button type="button" className="btn btn-s btn-sm" onClick={close} disabled={pending}>
              Cancelar
            </button>
            <button type="button" className="btn btn-p btn-sm" onClick={confirm} disabled={pending}>
              {pending ? 'Salvando…' : 'Confirmar'}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
