'use server';

import { revalidatePath } from 'next/cache';
import { hasSession } from '@/lib/dashboard/auth';
import { applyOrderStatus, type StatusInput, type StatusResult } from '@/lib/dashboard/status';

/** Fecha, marca como perdido (com motivo) ou reabre um pedido. */
export async function setOrderStatus(input: StatusInput): Promise<StatusResult> {
  if (!(await hasSession())) return { ok: false, error: 'Sua sessão expirou. Entre de novo.' };

  const result = await applyOrderStatus(input);
  if (result.ok) revalidatePath('/dashboard', 'layout');
  return result;
}
