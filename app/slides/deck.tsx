"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

// Palco fixo 16:9, escalado para caber na tela (projetor, notebook, celular).
const W = 1280;
const H = 720;

const SHADOW = "shadow-[0_18px_40px_-14px_rgba(51,24,46,.4)]";

const Slide = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`absolute inset-0 flex flex-col px-20 pb-[72px] pt-14 ${className}`}>{children}</div>
);
const Kicker = ({ children }: { children: ReactNode }) => (
  <p className="font-titulo text-[26px] italic text-primaria">{children}</p>
);
const Title = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`mt-2 font-titulo text-[58px] font-semibold leading-[1.05] tracking-[-.02em] text-balance text-tinta ${className}`}>
    {children}
  </h2>
);
const Photo = ({ name, alt, className = "" }: { name: string; alt: string; className?: string }) => (
  <Image src={`/slides/${name}.jpg`} alt={alt} width={480} height={400} className={`object-cover ${className}`} />
);
const Framed = `absolute border-[8px] border-white ${SHADOW}`;

const slides: ReactNode[] = [
  // 1. Capa
  <div key="capa" className="absolute inset-0 flex items-center px-20">
    <div className="flex-1">
      <p className="font-script text-[150px] leading-[.9] text-primaria">Evys Cakes</p>
      <h1 className="mt-6 font-titulo text-[56px] font-semibold leading-[1.05] tracking-[-.02em] text-tinta">
        Do orçamento ao <em className="text-primaria">pedido fechado</em>
      </h1>
      <p className="mt-6 max-w-[520px] text-[24px] leading-snug text-tinta-2">
        Um orçamento em link que ajuda o cliente a decidir e a Evy a não perder ninguém.
      </p>
      <p className="mt-14 text-[18px] text-tinta-2">Conectam · BTG Pactual × Inteli</p>
    </div>
    <div className="relative h-[600px] w-[500px]">
      <Photo name="bolo-felicidades" alt="Bolo branco com flores de papel e a palavra felicidades" className={`${Framed} right-0 top-2 h-[390px] w-[330px] rotate-3`} />
      <Photo name="gourmet-1" alt="Doces gourmet de ninho com Nutella e oreo" className={`${Framed} left-0 top-[270px] h-[240px] w-[240px] -rotate-6`} />
      <Photo name="cupcake" alt="Cupcakes com borboletas roxas" className={`${Framed} bottom-0 right-6 h-[210px] w-[230px] -rotate-2`} />
    </div>
  </div>,

  // 2. Problema: o número
  <Slide key="p1" className="bg-superficie !flex-row items-center gap-14">
    <p className="font-titulo text-[470px] font-bold leading-[.75] tracking-[-.05em] text-primaria">6</p>
    <div className="flex-1">
      <Kicker>o problema</Kicker>
      <h2 className="mt-2 font-titulo text-[52px] font-semibold leading-[1.08] tracking-[-.02em] text-tinta">
        de cada 10 pessoas que chamam a Evy <em className="text-primaria">não fecham o pedido.</em>
      </h2>
      <dl className="mt-10 divide-y divide-tinta/15 border-y border-tinta/15 text-[24px] text-tinta">
        {[
          ["30 a 40", "orçamentos enviados por mês"],
          ["2 a 4 sem.", "de conversa até fechar"],
          ["9 a 12", "pedidos fechados por mês. Cada orçamento recuperado pesa"],
        ].map(([n, t]) => (
          <div key={n} className="flex items-baseline gap-6 py-4">
            <dt className="w-[170px] shrink-0 font-titulo text-[34px] font-semibold tabular-nums text-primaria">{n}</dt>
            <dd className="leading-snug">{t}</dd>
          </div>
        ))}
      </dl>
    </div>
    <p className="absolute bottom-6 left-20 text-[16px] text-tinta-2">
      Números aproximados, informados pela Evy. O 9 a 12 é conta nossa (30% dos orçamentos).
    </p>
  </Slide>,

  // 3. Problema: onde some
  <Slide key="p2">
    <Kicker>o problema</Kicker>
    <Title>O cliente some depois de ver o valor</Title>
    <div className="relative mt-14">
      <p className="absolute -top-11 left-1/2 -rotate-3 font-script text-[36px] leading-none text-primaria">
        aqui a maioria desiste
      </p>
      <div className="absolute inset-x-0 top-[11px] h-px bg-tinta/30" />
      <ol className="relative grid grid-cols-6 text-[20px]">
        {["Contato", "Perguntas do evento", "Cardápio", "Orçamento", "Dúvida e comparação", "Fecha ou some"].map((s, n) => (
          <li key={s} className="pr-4">
            <span
              className={`block rounded-full ${n === 3 ? "-mt-[3px] size-7 bg-primaria" : "size-[22px] border-2 border-tinta/40 bg-fundo"}`}
            />
            <span className={`mt-3 block leading-tight ${n === 3 ? "font-semibold text-primaria" : "text-tinta"}`}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
    <div className="mt-10 grid grid-cols-3 divide-x divide-tinta/15">
      {[
        ["Vai comparar preços", "Diz que vai ver outros fornecedores e começa o ciclo de demora."],
        ["Leva para o noivo(a)", "Em casamentos, valida com outra pessoa e some nesse intervalo."],
        ["Imprevisto pessoal", "Depois de muita conversa, o evento muda ou é cancelado."],
      ].map(([t, d]) => (
        <div key={t} className="px-8 first:pl-0">
          <h3 className="font-titulo text-[30px] font-semibold leading-tight text-tinta">{t}</h3>
          <p className="mt-2 text-[22px] leading-snug text-tinta-2">{d}</p>
        </div>
      ))}
    </div>
    <p className="mt-auto border-l-4 border-primaria pl-6 font-titulo text-[30px] leading-snug text-tinta">
      E ninguém retoma. Sem registro de leads, <em className="text-primaria">tudo fica na memória da Evy.</em>
    </p>
  </Slide>,

  // 4. Ponte causa → resposta
  <Slide key="ponte" className="!flex-row gap-16">
    <div className="relative w-[360px] shrink-0">
      <Kicker>da dor à solução</Kicker>
      <Title>Cada causa tem uma resposta</Title>
      <Photo name="uva" alt="Surpresa de uva" className={`${Framed} bottom-2 left-0 h-[230px] w-[290px] -rotate-3`} />
    </div>
    <div className="flex flex-1 flex-col justify-center">
      {[
        ["Vai comparar preços", "Página clara com total, fotos e validade, no celular dele"],
        ["Vai validar com o noivo(a)", "Compartilhar: quem recebe vê tudo sem a Evy"],
        ["Demora e some", "Validade de 7 dias, com contagem regressiva"],
        ["Ninguém retoma", "Painel “retomar” com mensagem pronta, que a Evy aprova"],
      ].map(([c, r]) => (
        <div key={c} className="border-t border-tinta/20 py-6 last:border-b">
          <p className="text-[20px] text-tinta-2">{c}</p>
          <p className="mt-1 font-titulo text-[31px] font-medium leading-tight text-tinta">{r}</p>
        </div>
      ))}
    </div>
  </Slide>,

  // 5. Solução: fluxo
  <Slide key="fluxo">
    <Kicker>a solução</Kicker>
    <Title>Orçamento digital em link</Title>
    <div className="mt-8 grid grid-cols-5 gap-8">
      {[
        ["Cliente chama no WhatsApp", "Saudação nativa da conta comercial, com o link do site"],
        ["Monta o pedido no site", "Cardápio com preços e mínimos. O lead é salvo aqui"],
        ["Recebe o orçamento", "Total, entrada de 60% e validade de 7 dias"],
        ["Reserva a data", "Paga a entrada por Pix e manda o comprovante"],
        ["Evy personaliza e fecha", "Tema, cores e topper, pelo WhatsApp"],
      ].map(([t, d], n) => (
        <div key={t} className="border-t-2 border-primaria pt-3" style={{ marginTop: n * 32 }}>
          <p className="font-titulo text-[76px] font-semibold leading-none tabular-nums text-primaria">{n + 1}</p>
          <h3 className="mt-3 font-titulo text-[25px] font-semibold leading-tight text-tinta">{t}</h3>
          <p className="mt-2 text-[20px] leading-snug text-tinta-2">{d}</p>
        </div>
      ))}
    </div>
    <p className="absolute bottom-[72px] left-20 w-[430px] font-titulo text-[28px] leading-snug text-tinta">
      Sem bot e sem API. <em className="text-primaria">A conversa continua sendo da Evy;</em> o link só dá estrutura ao texto solto.
    </p>
  </Slide>,

  // 6. A página do orçamento
  <Slide key="orcamento" className="!flex-row items-center gap-12">
    <div className="w-[540px] shrink-0">
      <Kicker>a solução</Kicker>
      <Title>A página do orçamento</Title>
      <div className="mt-8">
        {[
          ["Total claro", "itens, entrada e restante num só lugar"],
          ["Validade", "a contagem regressiva cria urgência real"],
          ["Compartilhar", "o noivo(a) vê o mesmo link"],
          ["Reservar a data", "entrada de 60% por Pix"],
        ].map(([b, t]) => (
          <p key={b} className="border-t border-tinta/20 py-3 text-[23px] leading-snug text-tinta last:border-b">
            <em className="font-titulo text-[26px] text-primaria">{b}</em> · {t}
          </p>
        ))}
      </div>
    </div>
    <div className="relative flex flex-1 justify-center">
      <Photo name="gourmet-1" alt="Doces gourmet" className={`${Framed} left-0 top-6 h-[220px] w-[220px] -rotate-6`} />
      <div className={`relative z-10 ml-[130px] w-[390px] rotate-2 rounded-md bg-white p-7 ${SHADOW}`}>
        <p className="font-script text-[42px] leading-none text-primaria">Evys Cakes</p>
        <p className="mt-3 font-titulo text-[28px] font-semibold leading-tight text-tinta">Orçamento para Ana</p>
        <p className="mt-2 inline-block rounded-sm bg-urg-fundo px-2 py-1 text-[15px] font-semibold text-urg-texto">
          Vale por mais 6 dias
        </p>
        <div className="mt-3 text-[17px] tabular-nums text-tinta">
          {[
            ["100 doces tradicionais", "R$ 145,00"],
            ["50 doces gourmet", "R$ 95,00"],
          ].map(([a, b]) => (
            <p key={a} className="flex justify-between border-b border-dotted border-tinta/30 py-2">
              <span>{a}</span>
              <span>{b}</span>
            </p>
          ))}
          <p className="flex justify-between py-2 text-[21px] font-bold">
            <span>Total</span>
            <span>R$ 240,00</span>
          </p>
          <p className="flex justify-between py-1 text-tinta-2">
            <span>Entrada (60%)</span>
            <span>R$ 144,00</span>
          </p>
          <p className="flex justify-between py-1 text-tinta-2">
            <span>Restante na retirada</span>
            <span>R$ 96,00</span>
          </p>
        </div>
        <div className="mt-4 rounded-md bg-primaria py-3 text-center text-[17px] font-semibold text-white">Reservar a data</div>
        <p className="mt-3 flex justify-center gap-6 text-[16px] font-semibold text-primaria underline underline-offset-4">
          <span>Compartilhar</span>
          <span>Pedir ajuste</span>
        </p>
      </div>
    </div>
    <p className="absolute bottom-6 left-20 text-[16px] text-tinta-2">Exemplo ilustrativo, com preços do Cardápio 2026.</p>
  </Slide>,

  // 7. Painel da Evy
  <Slide key="painel" className="!flex-row items-center gap-14">
    <div className="w-[470px] shrink-0">
      <Kicker>a solução</Kicker>
      <Title>Para a Evy, ninguém se perde</Title>
      <p className="mt-6 text-[24px] leading-snug text-tinta">
        Todo orçamento tem um status, e o lead é salvo desde o primeiro passo.
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[20px] text-tinta-2">
        {[
          ["enviado", "bg-suave"],
          ["aberto", "bg-primaria"],
          ["reservado", "bg-ok"],
          ["expirado", "bg-urg"],
          ["ajuste pedido", "bg-tinta-2"],
        ].map(([s, c]) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`size-3 rounded-full ${c}`} />
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-titulo text-[26px] leading-snug text-tinta">
        Sem envio automático. <em className="text-primaria">A Evy revisa e aperta enviar,</em> e o tom pessoal fica.
      </p>
    </div>
    <div className={`flex-1 rounded-md bg-white p-8 ${SHADOW}`}>
      <p className="font-titulo text-[30px] font-semibold text-tinta">Retomar hoje</p>
      <div className="mt-3 divide-y divide-tinta/15 text-[21px]">
        {[
          ["Ana", "vence em 24h", "text-urg-texto"],
          ["Carla", "aberto, sem reserva", "text-primaria"],
        ].map(([n, s, c]) => (
          <div key={n} className="flex items-center justify-between py-4">
            <span className="w-[90px] font-semibold text-tinta">{n}</span>
            <span className={`flex-1 text-[19px] ${c}`}>{s}</span>
            <span className="rounded-md bg-ok px-4 py-2 text-[17px] font-semibold text-white">Abrir WhatsApp</span>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl rounded-tl-sm bg-ok-fundo px-5 py-4 text-[21px] leading-snug text-tinta">
        Oi, Ana! Seu orçamento vale até sexta. Posso ajudar com alguma dúvida?
      </p>
    </div>
    <p className="absolute bottom-6 left-20 text-[16px] text-tinta-2">Dados de exemplo.</p>
  </Slide>,

  // 8. Próximos passos
  <Slide key="proximos" className="pr-[340px]">
    <Kicker>próximos passos</Kicker>
    <Title>Começamos pequeno e deixamos espaço para crescer</Title>
    <div className="mt-8 grid grid-cols-2 gap-12">
      {[
        ["Agora", "text-tinta", ["Site com cardápio, carrinho e mínimos", "Captura de lead", "Orçamento em link, com validade e reserva", "Painel com retomada"]],
        ["Depois", "text-tinta-2", ["Bot pelo número dela (API oficial do WhatsApp)", "Pagamento com confirmação automática", "Calendário de capacidade", "Assessorias e buffets"]],
      ].map(([t, c, items]) => (
        <div key={t as string}>
          <h3 className="font-titulo text-[34px] italic text-primaria">{t as string}</h3>
          <ul className={`mt-2 text-[22px] leading-snug ${c}`}>
            {(items as string[]).map((i) => (
              <li key={i} className="border-t border-tinta/15 py-3">
                {i}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <p className="mt-auto text-[24px] leading-snug text-tinta">
      <span className="font-script text-[46px] leading-none text-primaria">a validar:</span> mandar o link para 3 clientes reais e ver se abrem, compartilham e reservam.
    </p>
    <div className="absolute bottom-16 right-0 top-0 flex w-[260px] flex-col">
      <Photo name="pao" alt="Mini pães de mel embalados com laço rosa" className="h-1/3 w-full" />
      <Photo name="uva" alt="Surpresa de uva" className="h-1/3 w-full" />
      <Photo name="trad-1" alt="Brigadeiros e beijinhos em forminhas vermelhas" className="h-1/3 w-full" />
    </div>
  </Slide>,

  // 9. Fim
  <div key="fim" className="absolute inset-0 flex items-center bg-primaria px-20">
    <div className="flex-1">
      <p className="font-script text-[190px] leading-[.9] text-white">Obrigada</p>
      <p className="mt-4 font-titulo text-[60px] italic text-superficie">Perguntas?</p>
    </div>
    <div className="relative h-[520px] w-[440px]">
      <Photo name="bolo-dino" alt="Bolo azul com tema de dinossauro" className={`${Framed} right-0 top-0 h-[290px] w-[350px] rotate-3`} />
      <Photo name="trad-2" alt="Brigadeiros em forminhas azuis" className={`${Framed} bottom-0 left-0 h-[240px] w-[250px] -rotate-6`} />
    </div>
  </div>,
];

export default function Deck() {
  const [i, setI] = useState(0);
  const [scale, setScale] = useState(0);
  const go = (d: number) => setI((n) => Math.max(0, Math.min(slides.length - 1, n + d)));

  useEffect(() => {
    const fit = () => setScale(Math.min(innerWidth / W, innerHeight / H));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) go(1);
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) go(-1);
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(slides.length - 1);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  return (
    <main
      className="deck fixed inset-0 z-50 select-none overflow-hidden bg-tinta font-corpo"
      onClick={(e) => go(e.clientX < innerWidth / 3 ? -1 : 1)}
    >
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden bg-fundo"
        style={{
          width: W,
          height: H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: scale ? 1 : 0,
          fontVariationSettings: '"SOFT" 100, "WONK" 1',
        }}
      >
        {slides.map((s, k) => (
          <div
            key={k}
            aria-hidden={k !== i}
            className={`absolute inset-0 transition-opacity duration-300 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {s}
          </div>
        ))}
        <div className="grain pointer-events-none absolute inset-0 opacity-[.12] mix-blend-multiply" />
        {i > 0 && i < slides.length - 1 && (
          <span className="absolute bottom-5 right-8 font-titulo text-[20px] tabular-nums text-tinta-2">
            {String(i + 1).padStart(2, "0")}
          </span>
        )}
      </div>
    </main>
  );
}
