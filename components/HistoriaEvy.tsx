import Image from "next/image";
import { Icon } from "./Icon";
import { Doodles } from "./Sprite";

// História contada pela Evy, resumida para o site. A frase em destaque vem do fim do texto dela.
// Confirmar com ela que está confortável com o que aparece (demissão, sociedade que não deu certo, acidente em 2021).
const CHAPTERS = [
  {
    icon: "i-cake",
    k: "Aos 15 anos",
    title: "Começou com trufas e pão de mel",
    text: "Aprendi a fazer trufas e pão de mel com um amigo de uma amiga e comecei a vender na escola, só para ter um dinheiro para o sorvete, o ônibus ou a biblioteca. O resto aprendi na raça, por pura curiosidade.",
  },
  {
    icon: "i-heart",
    k: "O recomeço",
    title: "Uma batedeira e uma barra de chocolate",
    text: "Depois de ser demitida de um emprego formal, apostei no que eu sabia fazer: comprei uma batedeira e uma barra de chocolate, fiz um curso de confeitaria e comecei a empreender. A primeira sociedade não deu certo, e foi o meu primeiro grande recomeço.",
  },
  {
    icon: "i-cupcake",
    k: "A escola da cozinha",
    title: "20 bolos em uma hora",
    text: "Passei cinco anos em uma confeitaria que eu admirava e aprendi o ritmo da produção em grande escala. À noite eu seguia assando para o meu próprio negócio, até pedir demissão para me dedicar 100% a ele.",
  },
  {
    icon: "i-spark",
    k: "Hoje",
    title: "Coragem e reinvenção",
    text: "Produzi mais de mil trufas por semana para uma rede de revendedores, mudei a rota na pandemia e recomecei de novo depois de um acidente em 2021. Hoje tenho um espaço de produção próprio, fruto de muita persistência.",
  },
];

export function HistoriaEvy() {
  return (
    <section className="story" id="historia">
      <Doodles className="bg" />
      <div className="w narrow">
        <div className="ph arch portrait reveal">
          <Image src="/fotos/evy.jpg" alt="Retrato da Evy, de faixa e jaleco rosa" fill sizes="240px" />
        </div>
        <div className="eyebrow">
          <Icon name="i-heart" />
          Quem faz seus doces
        </div>
        <h2>A história da Evy</h2>
        <blockquote className="quote-script reveal">“Uma história de coragem e constante reinvenção na confeitaria.”</blockquote>

        {CHAPTERS.map((c) => (
          <article className="chap reveal" key={c.k}>
            <span className="dot">
              <Icon name={c.icon} />
            </span>
            <span className="k">{c.k}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}

        <div className="sign reveal">— Evelyn Guimarães</div>
      </div>
    </section>
  );
}
