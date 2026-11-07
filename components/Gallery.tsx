import Image from "next/image";
import { GALLERY } from "./photos";

export function Gallery() {
  return (
    <ul className="gal" aria-label="Galeria de fotos">
      {GALLERY.slice(0, 8).map((p) => (
        <li key={p.src}>
          <div className="ph circ">
            <Image src={p.src} alt={p.alt} fill sizes="220px" />
          </div>
        </li>
      ))}
    </ul>
  );
}
