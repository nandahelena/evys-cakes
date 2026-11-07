import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Seu orçamento · Evys Cakes" };

export default function PedidoPage() {
  return (
    <>
      <SiteHeader />
      <Checkout />
    </>
  );
}
