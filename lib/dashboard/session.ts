import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Sessão da Evelyn: cookie com "expiração.assinatura" (HMAC-SHA256). A senha nunca vai para o cookie.
export const SESSION_COOKIE = 'evys_session';
export const SESSION_DAYS = 7;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // segundos

function secret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

/** Compara em tempo constante. Faz hash dos dois lados antes, pois timingSafeEqual exige o mesmo tamanho. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Confere a senha informada com ADMIN_PASSWORD. Sem ADMIN_PASSWORD configurada, nunca autentica. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** Cria o token assinado com expiração em 7 dias. Devolve null se SESSION_SECRET não estiver configurada. */
export function createSessionToken(now: number = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const exp = String(Math.floor(now / 1000) + SESSION_MAX_AGE);
  return `${exp}.${sign(exp, key)}`;
}

/** Valida assinatura e expiração. Nunca lança exceção. */
export function verifySessionToken(token: string | undefined | null, now: number = Date.now()): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [exp, sig, ...rest] = token.split('.');
  if (!exp || !sig || rest.length > 0 || !/^\d+$/.test(exp)) return false;
  if (!safeEqual(sig, sign(exp, key))) return false;
  return Number(exp) * 1000 > now;
}
