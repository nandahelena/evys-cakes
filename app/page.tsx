import Image from "next/image";
import Link from "next/link";
import { Sticker } from "@/components/Decor";
import { HistoriaEvy } from "@/components/HistoriaEvy";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { SiteHeader } from "@/components/SiteHeader";
import { Doodles } from "@/components/Sprite";
import { VALIDADE_DIAS, categoryMeta } from "@/lib/catalog";
import { GALLERY, PHOTO } from "@/components/photos";
import { brl } from "@/lib/labels";

const TILES = [
  { cat: "Bolos de massa baunilha", title: "Bolos" },
  { cat: "Doces tradicionais", title: "Doces tradicionais" },
  { cat: "Doces gourmet", title: "Doces gourmet" },
  { cat: "Cupcake", title: "Cupcakes" },
  { cat: "Surpresa de uva", title: "Surpresa de uva" },
  { cat: "Mini pão de mel", title: "Mini pão de mel" },
];

const STEPS = [
  { title: "Escolha seus doces", text: "Veja o cardápio com fotos e preços e monte o seu orçamento item por item." },
  { title: "Veja o valor na hora", text: `O orçamento fica pronto na hora, em um link só seu para guardar e compartilhar. Vale por ${VALIDADE_DIAS} dias.` },
  { title: "Reserve a data", text: "Pague a entrada de 60% e combine os detalhes da decoração direto com a Evy no WhatsApp." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <section className="hero2">
        <Doodles className="bg" />
        <div className="w hero-grid">
          <div>
            <span className="tag">Confeitaria artesanal</span>
            <h1>
              Doces feitos à mão
              <em>para o seu momento</em>
            </h1>
            <p className="sub">
              Aniversários, casamentos e ocasiões especiais. Monte o seu orçamento em poucos toques, veja o valor na hora e reserve a data.
            </p>
            <div className="cta">
              <Link className="btn btn-p btn-lg" href="/cardapio">
                <Icon name="i-cake" />
                Fazer meu orçamento
              </Link>
              <a className="btn btn-o btn-lg" href="#historia">
                Conhecer a Evy
              </a>
            </div>
          </div>

          <div className="collage">
            <div className="ph arch c-arch">
              <Image src={PHOTO.verde.src} alt={PHOTO.verde.alt} fill sizes="240px" />
            </div>
            <div className="ph ring c-ring">
              <div className="in">
                <Image src={PHOTO.azul.src} alt={PHOTO.azul.alt} fill sizes="260px" />
              </div>
            </div>
            <div className="ph circ c-circ">
              <Image src={PHOTO.magenta.src} alt={PHOTO.magenta.alt} fill sizes="220px" />
            </div>
            <Sticker className="c-stk" top="feito à mão" bottom="com carinho" />
          </div>
        </div>
      </section>
      <div className="fest-b" />

      <div className="marq" aria-label="Fotos dos doces">
        <div className="marq-track" aria-hidden="false">
          {[...GALLERY, ...GALLERY].map((p, i) => (
            <div className="ph circ" key={i} aria-hidden={i >= GALLERY.length}>
              <Image src={p.src} alt={i < GALLERY.length ? p.alt : ""} fill sizes="150px" />
            </div>
          ))}
        </div>
      </div>

      <section className="sec-pad" style={{ paddingTop: 24 }}>
        <div className="w center">
          <div className="eyebrow">
            <Icon name="i-spark" />
            Nosso trabalho
          </div>
          <h2>Feito à mão, do jeito que você imagina</h2>
          <p className="lead">Toque em uma foto para ver o cardápio daquele doce.</p>
          <div className="mosaic reveal">
            {TILES.map((t, i) => {
              const m = categoryMeta(t.cat);
              return (
                <Link key={t.cat} href={`/cardapio#${m.id}`} className={`tile ${i === 0 ? "big" : ""}`}>
                  <Image src={m.photo!} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
                  <span className="cap">
                    {t.title}
                    <small>
                      a partir de {brl(m.from)} {m.unit === "kg" ? "o kg" : "cada"}
                    </small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec-pad alt">
        <div className="fest-c" />
        <div className="w center">
          <div className="eyebrow">
            <Icon name="i-spark" />
            Como funciona
          </div>
          <h2>Do cardápio à reserva em 3 passos</h2>
          <div className="steps3">
            {STEPS.map((s, i) => (
              <div className="step reveal" key={s.title}>
                <div className="n">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HistoriaEvy />

      <section className="band">
        <Doodles className="bg" />
        <div className="w">
          <h2>Vamos adoçar o seu evento?</h2>
          <p>Monte o orçamento agora e veja o valor na hora.</p>
          <Link className="btn btn-w btn-lg" href="/cardapio">
            <Icon name="i-cake" />
            Fazer meu orçamento
          </Link>
        </div>
      </section>

      <footer className="foot">
        <div className="w">
          <Logo variant="m" className="mini" />
          <p>
            Evys Cakes · confeitaria artesanal.
            <br />
            Retirada com a Evy. Encomendas com pelo menos 7 dias de antecedência.
          </p>
        </div>
      </footer>
    </>
  );
}
