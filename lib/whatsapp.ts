// Número da Evy (só dígitos, com 55) vem do ambiente; sem ele o link abre o WhatsApp sem destinatário.
export function waLink(text: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
