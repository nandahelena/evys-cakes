import { OrderDraft } from './types';

const BASE_PER_GUEST = 18;
const DECOR = { simple: 0, elaborate: 150, premium: 400 };
const EVENT_MULT = { wedding: 1.3, corporate: 1.1, birthday: 1, other: 1 };

export function calculateQuote(o: OrderDraft) {
  const base = o.guests * BASE_PER_GUEST;
  const decor = DECOR[o.decor];
  const total = Math.round(base * EVENT_MULT[o.eventType] + decor);
  return { total, breakdown: { base, decor, multiplier: EVENT_MULT[o.eventType] } };
}
