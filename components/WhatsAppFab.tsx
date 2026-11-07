import { waLink } from "@/lib/whatsapp";
import { Icon } from "./Icon";

// Botão sempre visível em todas as páginas.
export function WhatsAppFab() {
  return (
    <a
      className="fab"
      href={waLink("Oi, Evy! Vim pelo site e gostaria de fazer uma encomenda.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Evy no WhatsApp"
    >
      <Icon name="i-chat" />
      <span>Falar com a Evy</span>
    </a>
  );
}
