'use server';

import { redirect } from 'next/navigation';
import { calculateQuote, eventDateError, todayInSaoPaulo } from '@/lib/pricing';
import { supabaseServer } from '@/lib/supabase-server';
import type { CartLine } from '@/lib/types';

export type OrderState = { error?: string; values?: Record<string, string> };

const EVENT_TYPES = ['wedding', 'birthday', 'corporate', 'other'];
const FIELDS = ['name', 'phone', 'eventDate', 'eventType', 'guests', 'venue', 'decor', 'notes'];

function parseItems(raw: string): CartLine[] | null {
  try {
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length > 60) return null;
    return arr.map((i) => ({
      id: String(i?.id ?? ''),
      qty: Number(i?.qty),
      choice:
        i?.choice && typeof i.choice === 'object'
          ? Object.fromEntries(Object.entries(i.choice).map(([k, v]) => [k, String(v)]))
          : undefined,
    }));
  } catch {
    return null;
  }
}

// Recalcula tudo no servidor (nunca confia no valor que veio do navegador) e grava cliente, pedido e orçamento.
export async function createOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  const values = Object.fromEntries(FIELDS.map((k) => [k, get(k)]));
  const fail = (error: string): OrderState => ({ error, values });

  const phone = values.phone.replace(/\D/g, '');
  const guests = Number.parseInt(values.guests, 10);
  if (values.name.length < 2 || values.name.length > 80) return fail('Informe seu nome.');
  if (phone.length < 10 || phone.length > 13) return fail('Informe um WhatsApp válido, com DDD.');
  if (!EVENT_TYPES.includes(values.eventType)) return fail('Escolha o tipo de evento.');
  if (!(guests >= 1 && guests <= 5000)) return fail('Informe o número de convidados.');
  const dateError = eventDateError(values.eventDate, todayInSaoPaulo());
  if (dateError) return fail(dateError);
  if (values.venue.length > 200 || values.decor.length > 600 || values.notes.length > 600) return fail('Algum texto ficou longo demais.');

  const items = parseItems(get('items'));
  if (!items) return fail('Não foi possível ler o seu pedido. Tente de novo.');
  const quote = calculateQuote(items);
  if (!quote.ok) return fail(quote.errors[0]);

  const db = supabaseServer();
  const customer = await db.from('customers').insert({ name: values.name, phone }).select('id').single();
  if (customer.error) return fail('Não conseguimos salvar o seu pedido agora. Tente de novo em instantes.');

  const order = await db
    .from('orders')
    .insert({
      customer_id: customer.data.id,
      event_date: values.eventDate,
      event_type: values.eventType,
      guests,
      decor: values.decor || null,
      venue: values.venue || null,
      notes: values.notes || null,
    })
    .select('id')
    .single();
  if (order.error) return fail('Não conseguimos salvar o seu pedido agora. Tente de novo em instantes.');

  const token = crypto.randomUUID().replaceAll('-', ''); // 122 bits aleatórios: o link é a única chave de acesso
  const saved = await db
    .from('quotes')
    .insert({ order_id: order.data.id, total: quote.total, breakdown: quote.breakdown, public_token: token });
  if (saved.error) return fail('Não conseguimos gerar o orçamento agora. Tente de novo em instantes.');

  redirect(`/quote/${token}?novo=1`);
}

// Marca a abertura do link. Chamado pelo navegador (crawlers de pré-visualização do WhatsApp não executam JS).
export async function markViewed(token: string) {
  if (!/^[a-f0-9]{32}$/.test(token)) return;
  const db = supabaseServer();
  const { data } = await db.from('quotes').select('order_id, sent_at, viewed_at').eq('public_token', token).maybeSingle();
  if (!data || data.viewed_at) return;
  // shortcut: ignora aberturas nos 2 primeiros minutos (é a própria cliente logo após gerar); refinar se o painel precisar de mais precisão
  if (Date.now() - Date.parse(data.sent_at) < 120_000) return;
  await db.from('quotes').update({ viewed_at: new Date().toISOString() }).eq('public_token', token);
  await db.from('orders').update({ status: 'viewed' }).eq('id', data.order_id).eq('status', 'quote_sent');
}
