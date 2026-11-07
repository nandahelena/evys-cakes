import Image from "next/image";
import Link from "next/link";
import { Sticker } from "@/components/Decor";
import { HistoriaEvy } from "@/components/HistoriaEvy";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { GALLERY, PHOTO } from "@/components/photos";
import { SiteHeader } from "@/components/SiteHeader";
import { Doodles } from "@/components/Sprite";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <section className="hero2">
        <Doodles className="bg" />
        <div className="w hero-grid">
          <div>
            <p className="kicker">confeitaria artesanal</p>
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

      <section className="work">
        <h2 className="work-title">Conheça nosso trabalho</h2>
        <div className="marq" aria-label="Fotos dos doces">
          <div className="marq-track">
            {[...GALLERY, ...GALLERY].map((p, i) => (
              <div className="ph circ" key={i} aria-hidden={i >= GALLERY.length}>
                <Image src={p.src} alt={i < GALLERY.length ? p.alt : ""} fill sizes="220px" />
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
