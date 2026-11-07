'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { saveAgentDraft, type AgentDraft } from '@/lib/agent/handoff';
import { EVENT_TYPE_LABEL } from '@/lib/labels';
import { waLink } from '@/lib/whatsapp';

type Msg = { role: 'user' | 'assistant'; content: string };
type ChatState = { messages: Msg[]; draft: AgentDraft; missing: string[]; ready: boolean };

const GREETING: Msg = {
  role: 'assistant',
  content:
    'Oi! Eu sou a assistente da Evys Cakes 🌸 Vou te fazer umas perguntas rápidas sobre a sua festa, para a Evy montar o seu pedido. Que tipo de festa você está planejando?',
};
const INITIAL: ChatState = { messages: [GREETING], draft: {}, missing: ['eventType', 'eventDate', 'guests', 'name', 'phone'], ready: false };
const QUICK = ['Aniversário', 'Casamento', 'Evento corporativo', 'Outro tipo de festa'];
const STORE = 'evys-chat-v1'; // conversa sobrevive a ir no cardápio e voltar (só nesta aba)
const MAX_CHARS = 1000;

const FIELDS: { key: keyof AgentDraft; label: string; required?: boolean }[] = [
  { key: 'eventType', label: 'Tipo de festa', required: true },
  { key: 'eventDate', label: 'Data', required: true },
  { key: 'guests', label: 'Convidados', required: true },
  { key: 'decor', label: 'Decoração' },
  { key: 'venue', label: 'Local' },
  { key: 'name', label: 'Nome', required: true },
  { key: 'phone', label: 'WhatsApp', required: true },
];

const dmy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
function show(key: keyof AgentDraft, d: AgentDraft): string | null {
  const v = d[key];
  if (v === undefined || v === null || v === '') return null;
  if (key === 'eventType') return EVENT_TYPE_LABEL[v as NonNullable<AgentDraft['eventType']>];
  if (key === 'eventDate') return dmy(String(v));
  return String(v);
}

function summary(d: AgentDraft): string {
  const lines = FIELDS.map((f) => {
    const v = show(f.key, d);
    return v ? `${f.label}: ${v}` : null;
  }).filter(Boolean);
  if (d.notes) lines.push(`Observações: ${d.notes}`);
  return `Oi, Evy! Conversei com a assistente do site sobre a minha festa:\n${lines.join('\n')}`;
}

export function Chat() {
  const router = useRouter();
  const [state, setState] = useState<ChatState>(INITIAL);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [restored, setRestored] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restaura a conversa desta aba (ex.: voltou do cardápio).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) setState(JSON.parse(raw) as ChatState);
    } catch {}
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(state));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state, restored, sending]);

  async function send(content: string) {
    const clean = content.trim().slice(0, MAX_CHARS);
    if (!clean || sending) return;
    setError('');
    setText('');
    const messages: Msg[] = [...state.messages, { role: 'user', content: clean }];
    setState((s) => ({ ...s, messages }));
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, draft: state.draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.reply !== 'string') {
        // devolve o texto ao campo para a cliente tentar de novo sem redigitar
        setState((s) => ({ ...s, messages: s.messages.slice(0, -1) }));
        setText(clean);
        setError(data.error ?? 'Tive um probleminha aqui. Você pode tentar de novo ou falar com a Evy pelo WhatsApp.');
        return;
      }
      setState({
        messages: [...messages, { role: 'assistant', content: data.reply }],
        draft: data.draft ?? {},
        missing: data.missing ?? [],
        ready: !!data.ready,
      });
      saveAgentDraft(data.draft ?? {});
    } catch {
      setState((s) => ({ ...s, messages: s.messages.slice(0, -1) }));
      setText(clean);
      setError('Sem conexão no momento. Confira sua internet e tente de novo.');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  const goToMenu = () => {
    saveAgentDraft(state.draft);
    router.push('/cardapio');
  };

  const restart = () => {
    setState(INITIAL);
    setError('');
    setText('');
    try {
      sessionStorage.removeItem(STORE);
    } catch {}
    inputRef.current?.focus();
  };

  const filled = FIELDS.filter((f) => f.required && show(f.key, state.draft)).length;
  const required = FIELDS.filter((f) => f.required).length;
  const started = state.messages.some((m) => m.role === 'user');

  return (
    <div className="chat">
      <div className="chat-head">
        <Logo variant="m" className="chat-avatar" />
        <div>
          <h1>Assistente da Evys Cakes</h1>
          <p>Conte da sua festa e a Evy monta o seu pedido.</p>
        </div>
        {started && (
          <button type="button" className="chat-restart" onClick={restart}>
            Recomeçar
          </button>
        )}
      </div>

      <details className="chat-progress">
        <summary>
          <span className="bar" aria-hidden="true">
            <i style={{ width: `${(filled / required) * 100}%` }} />
          </span>
          Anotado: {filled} de {required} informações
        </summary>
        <dl>
          {FIELDS.map((f) => {
            const v = show(f.key, state.draft);
            return (
              <div key={f.key} className={v ? 'ok' : ''}>
                <dt>
                  {f.label}
                  {!f.required && <small> (opcional)</small>}
                </dt>
                <dd>{v ?? '—'}</dd>
              </div>
            );
          })}
        </dl>
      </details>

      <div className="chat-log" role="log" aria-live="polite" aria-label="Conversa com a assistente">
        {state.messages.map((m, i) => (
          <div key={i} className={`bub ${m.role === 'user' ? 'me' : 'bot'}`}>
            {m.content}
          </div>
        ))}

        {sending && (
          <div className="bub bot typing" aria-label="A assistente está digitando">
            <i />
            <i />
            <i />
          </div>
        )}

        {!started && !sending && (
          <div className="chat-quick" aria-label="Respostas rápidas">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {state.ready && !sending && (
          <div className="chat-done">
            <b>Tudo anotado!</b>
            <p>Agora é só escolher os doces. O que você contou aqui já vai preenchido no pedido.</p>
            <button type="button" className="btn btn-p" onClick={goToMenu}>
              <Icon name="i-cake" />
              Escolher os doces
            </button>
            <a className="btn btn-s" href={waLink(summary(state.draft))} target="_blank" rel="noopener noreferrer">
              <Icon name="i-chat" />
              Enviar resumo para a Evy
            </a>
          </div>
        )}
        <div ref={endRef} className="chat-end" />
      </div>

      {error && (
        <p className="err chat-err" role="alert">
          {error}
        </p>
      )}

      <form className="chat-input" onSubmit={onSubmit}>
        <label htmlFor="chat-text" className="sr-only">
          Sua mensagem
        </label>
        <textarea
          id="chat-text"
          ref={inputRef}
          rows={1}
          value={text}
          maxLength={MAX_CHARS}
          placeholder="Escreva sua mensagem…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(text);
            }
          }}
          disabled={sending}
        />
        <button type="submit" className="btn btn-p chat-send" disabled={sending || !text.trim()} aria-label="Enviar mensagem">
          Enviar
        </button>
      </form>

      <p className="chat-foot">
        Assistente virtual com IA: ela não informa preços nem confirma datas, quem confirma é a Evy. Não envie dados sensíveis.{' '}
        <Link href="/cardapio" onClick={() => saveAgentDraft(state.draft)}>
          Prefiro escolher direto no cardápio
        </Link>
      </p>
    </div>
  );
}
