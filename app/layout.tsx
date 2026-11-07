import type { Metadata } from "next";
import { Figtree, Fraunces, Great_Vibes } from "next/font/google";
import "./globals.css";
import "./brand.css";
import "./front.css";
import { Sprite } from "@/components/Sprite";
import { WhatsAppFab } from "@/components/WhatsAppFab";

const titulo = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK"], variable: "--f-titulo" });
const corpo = Figtree({ subsets: ["latin"], variable: "--f-corpo" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--f-script" });

export const metadata: Metadata = {
  title: "Evys Cakes · confeitaria artesanal",
  description: "Monte seu pedido de doces, veja o valor na hora e reserve a data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${corpo.variable} ${script.variable}`}>
      <body>
        <Sprite />
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
