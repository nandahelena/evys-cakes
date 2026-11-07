import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="top">
      <div className="w top-in">
        <Link href="/" className="brand" aria-label="Evys Cakes, página inicial">
          <Logo variant="hm" />
        </Link>
        <Link className="btn btn-p btn-sm" href="/cardapio">
          Fazer meu orçamento
        </Link>
      </div>
    </header>
  );
}
