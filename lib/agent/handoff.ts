'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { OrderDraft } from '../types';

// Ponte entre a conversa (/conversa) e o formulário do pedido (/pedido): o que a cliente contou
// para a assistente fica guardado neste navegador e preenche o formulário. Expira em 24 h.
const KEY = 'evys-agent-draft-v1';
const TTL_MS = 24 * 60 * 60 * 1000;

export type AgentDraft = Partial<Omit<OrderDraft, 'items'>>;
type Stored = { at: number; draft: AgentDraft };

export function saveAgentDraft(draft: AgentDraft) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), draft } satisfies Stored));
  } catch {
    // navegação privada ou armazenamento bloqueado: o formulário só não vem preenchido
  }
}

export function clearAgentDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

const readRaw = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/**
 * Rascunho da conversa no formato dos campos do formulário (tudo string), ou null.
 * No servidor é sempre null; o formulário só monta no navegador, então recebe o valor certo.
 */
export function useAgentDraftValues(): Record<string, string> | null {
  const raw = useSyncExternalStore(
    () => () => {},
    readRaw,
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const { at, draft } = JSON.parse(raw) as Stored;
      if (!draft || Date.now() - at > TTL_MS) return null;
      const values: Record<string, string> = {};
      for (const [k, v] of Object.entries(draft)) if (v !== undefined && v !== null && v !== '') values[k] = String(v);
      return Object.keys(values).length ? values : null;
    } catch {
      return null;
    }
  }, [raw]);
}
