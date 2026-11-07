import type { Metadata } from "next";
import { Figtree, Fraunces, Great_Vibes } from "next/font/google";
import Deck from "./deck";

const titulo = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "WONK"], variable: "--f-titulo" });
const corpo = Figtree({ subsets: ["latin"], variable: "--f-corpo" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--f-script" });

export const metadata: Metadata = { title: "Evys Cakes — Apresentação" };

export default function Page() {
  return (
    <div className={`${titulo.variable} ${corpo.variable} ${script.variable}`}>
      <Deck />
    </div>
  );
}
