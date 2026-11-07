import { STATUS_LABEL } from '@/lib/labels';
import type { OrderStatus } from '@/lib/dashboard/types';

/** Etiqueta de status com as cores semânticas da marca (rosa = enviado, laranja = visualizado, verde = fechado, cinza = perdido). */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`st st-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function FollowUpBadge() {
  return <span className="st st-follow">Fazer follow-up</span>;
}
