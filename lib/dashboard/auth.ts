import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './session';

/** Defesa em profundidade: as ações do painel conferem a sessão por conta própria, além do proxy.ts. */
export async function hasSession(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}
