import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Gallery } from "@/components/Gallery";
import { Historia } from "@/components/Historia";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Dock, NovoCard, TalkButton, ViewTracker } from "@/components/QuoteActions";
import { VALIDADE_DIAS } from "@/lib/catalog";
import { brl, EVENT_TYPE_LABEL } from "@/lib/labels";
import type { QuoteLine } from "@/lib/pricing";
import { supabaseServer } from "@/lib/supabase-server";
import type { OrderDraft } from "@/lib/types";

// Link privado: fora do Google. O token aleatório é a única chave de acesso.
export const metadata: Metadata = { title: "Seu orçamento · Evys Cakes", robots: { index: false, follow: false } };

type Row = {
  total: number;
  breakdown: { lines: QuoteLine[]; entradaPct: number };
  sent_at: string;
  orders: {
    event_date: string;
    event_type: OrderDraft["eventType"];
    guests: number;
    venue: string | null;
    decor: string | null;
    notes: string | null;
    customers: { name: string };
  };
};

const DAY = 86_400_000;
const msUntil = (timestamp: number) => timestamp - Date.now(); // chamado só depois de connection(): é por requisição
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const dayMonth = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;
const dmy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const noun = (t: OrderDraft["eventType"]) => (t === "other" ? "evento" : EVENT_TYPE_LABEL[t].toLowerCase());
const qtyLabel = (l: QuoteLine) => `${String(l.qty).replace(".", ",")} ${l.unit} × ${brl(l.unitPrice)}`;

export default function QuotePage({ params, searchParams }: PageProps<"/quote/[token]">) {
  return (
    <Suspense fallback={<div className="qw"><p className="small" style={{ padding: 40 }}>Abrindo o seu orçamento…</p></div>}>
      <Quote params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Quote({ params, searchParams }: Pick<PageProps<"/quote/[token]">, "params" | "searchParams">) {
  await connection(); // usa a hora atual para a validade
  const { token } = await params;
  const { novo } = await searchParams;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();

  const { data } = await supabaseServer()
    .from("quotes")
    .select("total, breakdown, sent_at, orders(event_date, event_type, guests, venue, decor, notes, customers(name))")
    .eq("public_token", token)
    .maybeSingle();
  if (!data) notFound();

  const q = data as unknown as Row;
  const o = q.orders;
  const { lines, entradaPct } = q.breakdown;
  const total = Number(q.total);
  const entrada = Math.round(total * entradaPct * 100) / 100;
  const code = token.slice(0, 6).toUpperCase();

  const expiresAt = Date.parse(q.sent_at) + VALIDADE_DIAS * DAY;
  const msLeft = msUntil(expiresAt);
  const expired = msLeft <= 0;
  const daysLeft = Math.ceil(msLeft / DAY);
  const until = dmy(new Date(expiresAt).toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }));
  const pct = Math.max(0, Math.min(100, (msLeft / (VALIDADE_DIAS * DAY)) * 100));

  return (
    <div className="qw">
      <ViewTracker token={token} />
      <div className="t-bar">
        <div className="brand"><Logo variant="hm" /></div>
        <div className="no">ORÇAMENTO<br />Nº {code}</div>
      </div>
      <div className="scal" />

      <div className="o-body">
        <div className="o-hi">Olá, {o.customers.name.split(" ")[0]}</div>
        <p className="o-sub">Este é o orçamento do seu {noun(o.event_type)}. Qualquer dúvida, é só chamar a Evy.</p>

        <div className="ticket">
          <div><small>Data</small><b>{dayMonth(o.event_date)}</b></div>
          <div><small>Convidados</small><b>{o.guests}</b></div>
          <div><small>Entrega</small><b>Retirada</b></div>
        </div>

        {novo && !expired && <NovoCard code={code} />}

        <div className="sec">Seu pedido</div>
        {lines.map((l) => (
          <div className="li" key={l.id}>
            <span className={`th ${l.photo ? "" : "ph-icon"}`} style={{ width: 56, height: 56 }}>
              {l.photo ? <Image src={l.photo} alt="" fill sizes="56px" style={{ objectFit: "cover" }} /> : <Icon name="i-topper" />}
            </span>
            <div>
              <b>{l.name}</b>
              <small>{l.choice ? `${l.choice} · ` : ""}{qtyLabel(l)}</small>
            </div>
            <div className="v">{brl(l.subtotal)}</div>
          </div>
        ))}

        <div className="sum">
          <div className="tot"><span>Total</span><b>{brl(total)}</b></div>
          <div className="ent"><span>Entrada para reservar ({Math.round(entradaPct * 100)}%)</span><span>{brl(entrada)}</span></div>
          <div><span>Restante, na retirada</span><span>{brl(Math.round((total - entrada) * 100) / 100)}</span></div>
        </div>

        {expired ? (
          <div className="valid off">
            <div className="h"><Icon name="i-clock" /><span>Este orçamento venceu em {until}</span></div>
            <p>Fale com a Evy para renovar ou faça um novo pedido.</p>
          </div>
        ) : (
          <div className="valid">
            <div className="h"><Icon name="i-clock" /><span>Válido até {until}</span><span>{daysLeft === 1 ? "falta 1 dia" : `faltam ${daysLeft} dias`}</span></div>
            <div className="bar"><i style={{ width: `${pct}%` }} /></div>
            <p>Este orçamento vale até essa data. Para reservar, pague a entrada.</p>
          </div>
        )}

        {(o.venue || o.decor || o.notes) && (
          <>
            <div className="sec">Detalhes do evento</div>
            {o.venue && <div className="detail"><b>Local:</b> {o.venue}</div>}
            {o.decor && <div className="detail"><b>Decoração:</b> {o.decor}</div>}
            {o.notes && <div className="detail"><b>Observações:</b> {o.notes}</div>}
          </>
        )}

        <div className="sec">Como reservar</div>
        <ol className="how">
          <li><b>Pague a entrada de {Math.round(entradaPct * 100)}%</b><span>Pix, cartão ou dinheiro, como combinar com a Evy.</span></li>
          <li><b>Combine os detalhes</b><span>Decoração, cores e topper direto no WhatsApp.</span></li>
          <li><b>Retire e pague o restante</b><span>No dia combinado, com a Evy.</span></li>
        </ol>
        <p className="small">Em caso de desistência, a entrada não é devolvida. A entrega só ocorre com o pedido 100% pago.</p>

        <TalkButton code={code} />
      </div>

      <div className="sec" style={{ padding: "0 18px" }}>Nossos doces</div>
      <Gallery />
      <Historia />

      <Dock code={code} dateLabel={dayMonth(o.event_date)} entrada={brl(entrada)} expired={expired} />
    </div>
  );
}
