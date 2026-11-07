export type OrderDraft = {
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'other';
  guests: number;
  decor: 'simple' | 'elaborate' | 'premium';
  venue?: string;
  notes?: string;
  name: string;
  phone: string;
  email?: string;
};
