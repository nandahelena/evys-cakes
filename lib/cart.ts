'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { CartLine } from './types.ts';

// Carrinho só no navegador (localStorage); o servidor recalcula tudo ao gerar o orçamento.
const KEY = 'evys-cart-v1';
const EVENT = 'evys-cart-change';
let fallback = '[]'; // se o localStorage estiver bloqueado, o carrinho vive na memória da aba

const read = () => {
  try {
    return localStorage.getItem(KEY) ?? '[]';
  } catch {
    return fallback;
  }
};

const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(EVENT, cb);
  };
};

const parse = (raw: string): CartLine[] => {
  try {
    const a: unknown = JSON.parse(raw);
    return Array.isArray(a) ? (a as CartLine[]) : [];
  } catch {
    return [];
  }
};

function write(lines: CartLine[]) {
  fallback = JSON.stringify(lines);
  try {
    localStorage.setItem(KEY, fallback);
  } catch {
    // sem localStorage: segue só com a memória
  }
  window.dispatchEvent(new Event(EVENT));
}

// `ready` é falso no servidor e na hidratação, para a tela não piscar "carrinho vazio".
export function useCart() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const lines = useMemo(() => parse(raw ?? '[]'), [raw]);
  return { lines, ready: raw !== null };
}

export const readCart = () => parse(read());

// Troca as linhas de um conjunto de itens (ex.: todos os sabores de uma categoria).
export function replaceLines(ids: string[], next: CartLine[]) {
  write([...readCart().filter((l) => !ids.includes(l.id)), ...next.filter((l) => l.qty > 0)]);
}

export const setLine = (line: CartLine) => replaceLines([line.id], [line]);
export const clearCart = () => write([]);
