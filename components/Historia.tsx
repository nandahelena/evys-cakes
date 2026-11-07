import { Icon } from "./Icon";

// Versão curta da história da Evy (a completa está em HistoriaEvy, na landing).
export function Historia() {
  return (
    <section className="sec-pad alt">
      <div className="fest-c" />
      <div className="w">
        <div className="eyebrow">
          <Icon name="i-heart" />
          Quem faz seus doces
        </div>
        <h2>Evelyn Guimarães, confeitaria artesanal</h2>
        <p className="lead about">
          A Evy começou aos 15 anos, vendendo trufas e pão de mel na escola. Hoje a Evys Cakes faz doces sob encomenda
          para aniversários, casamentos e outras ocasiões especiais, com atendimento direto dela.
        </p>
      </div>
    </section>
  );
}
