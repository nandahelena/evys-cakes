// Uma linha do carrinho: id do item no catálogo, quantidade e escolhas sem efeito no preço (massa, recheio).
export type CartLine = { id: string; qty: number; choice?: Record<string, string> };

export type OrderDraft = {
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'other';
  guests: number;
  decor?: string; // texto livre: estilo e decoração do evento
  venue?: string;
  notes?: string;
  name: string;
  phone: string;
  email?: string;
  items: CartLine[];
};
