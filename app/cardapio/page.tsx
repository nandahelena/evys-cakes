import type { Metadata } from "next";
import { Cardapio } from "@/components/Cardapio";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Cardápio 2026 · Evys Cakes" };

export default function CardapioPage() {
  return (
    <>
      <SiteHeader />
      <Cardapio />
    </>
  );
}
