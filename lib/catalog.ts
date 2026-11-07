// Preços e regras do Cardápio 2026 (docs-empreendedora/cardapio-2026/). Valores em reais.
// Se a Evy mudar um preço, é só editar aqui: o orçamento é calculado a partir desta lista.
export const ENTRADA_PCT = 0.6; // entrada no ato da encomenda
export const VALIDADE_DIAS = 7; // validade do orçamento (confirmado pela Evy)
export const ANTECEDENCIA_DIAS = 7; // encomendas com no mínimo 7 dias
export const DOCES_MIN = 50; // mínimo de doces no pedido todo (tradicionais + gourmet somados)

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number; // por unidade ou por kg
  unit: 'un' | 'kg';
  min: number; // mínimo desta linha
  step: number;
  minGroup?: 'doces'; // o mínimo vale para a soma do grupo, não para a linha
  options?: { name: string; choices: string[] }[]; // escolhas sem efeito no preço
  photo?: string;
};

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

type Base = Pick<Product, 'price' | 'unit' | 'min' | 'step' | 'minGroup' | 'options'>;

const group = (category: string, photo: string | undefined, base: Base, names: string[]): Product[] =>
  names.map((name) => ({ ...base, id: slug(`${category}-${name}`), name, category, photo }));

const RECHEIOS_PEQUENOS = ['Ninho', 'Brigadeiro', 'Coco', 'Doce de leite'];

const bolo = (massa: string, price: number, recheios: string[]) =>
  group(
    `Bolos de massa ${massa}`,
    '/fotos/bolo-felicidades.jpg',
    { price, unit: 'kg', min: 1.5, step: 0.5 },
    recheios.map((r) => `Bolo ${massa} · ${r}`),
  );

export const PRODUCTS: Product[] = [
  ...group(
    'Doces tradicionais',
    '/fotos/brigadeiro-azul.jpg',
    { price: 145 / 100, unit: 'un', min: 1, step: 10, minGroup: 'doces' },
    ['Brigadeiro', 'Beijinho', 'Ninho', 'Dois amores', 'Prestígio'],
  ),
  ...group(
    'Doces gourmet',
    '/fotos/flor-magenta.jpg',
    { price: 95 / 50, unit: 'un', min: 1, step: 10, minGroup: 'doces' },
    ['Ninho com Nutella', 'Maracujá', 'Churros', 'Ferrero Rocher', 'Brigadeiro', 'Bicho de pé com Nutella', 'Romeu e Julieta', 'Oreo', 'Confete'],
  ),
  ...group('Cupcake', '/fotos/cupcake.jpg', {
    price: 4, unit: 'un', min: 12, step: 6,
    options: [
      { name: 'Massa', choices: ['Chocolate', 'Baunilha', 'Cenoura'] },
      { name: 'Recheio', choices: RECHEIOS_PEQUENOS },
    ],
  }, ['Cupcake']),
  ...group('Surpresa de uva', '/fotos/surpresa-de-uva.jpg', { price: 2.5, unit: 'un', min: 30, step: 10 }, ['Surpresa de uva']),
  ...group('Mini pão de mel', '/fotos/mini-pao-de-mel.jpg', {
    price: 4, unit: 'un', min: 15, step: 5,
    options: [{ name: 'Recheio', choices: RECHEIOS_PEQUENOS }],
  }, ['Mini pão de mel']),
  ...bolo('baunilha', 90, ['Maracujá', 'Abacaxi com creme de coco', 'Abacaxi com ninho', 'Beijinho', 'Brigadeiro branco']),
  ...bolo('baunilha', 92, ['Ninho trufado', 'Ninho com morangos', 'Brigadeiro branco com morangos']),
  ...bolo('chocolate', 90, ['Maracujá trufado', 'Mousse de chocolate', 'Sensação', 'Brigadeiro', 'Prestígio']),
  ...bolo('chocolate', 95, ['Mousse meio amargo', 'Ninho trufado', 'Dois amores', 'Ninho com morangos', 'Trufado', 'Ovomaltine']),
];

export const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

// Avisos extras de cada item (o preço e o mínimo já aparecem nas etiquetas da folha de detalhes).
export const CATEGORY_NOTE: Record<string, string | undefined> = {
  Cupcake: 'Uma massa e um recheio por pedido. Para sabores misturados, conte nas observações.',
  'Mini pão de mel': 'Um recheio por pedido. Para sabores misturados, conte nas observações.',
  'Bolos de massa baunilha': 'Decoração e topper a gente combina no WhatsApp.',
  'Bolos de massa chocolate': 'Decoração e topper a gente combina no WhatsApp.',
};

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];

// Descrições só com o que está no cardápio da Evy (sabores, massas, recheios, mínimos). TODO: trocar pelas descrições dela.
const CATEGORY_DESC: Record<string, string> = {
  'Doces tradicionais': 'Brigadeiro, beijinho, ninho, dois amores e prestígio. Os doces acompanham caixinhas nas cores tradicionais.',
  'Doces gourmet': 'Ninho com Nutella, maracujá, churros, Ferrero Rocher, brigadeiro, bicho de pé com Nutella, Romeu e Julieta, Oreo e confete.',
  Cupcake: 'Massa de chocolate, baunilha ou cenoura, com recheio de ninho, brigadeiro, coco ou doce de leite.',
  'Surpresa de uva': 'Doce branco com uma uva por dentro.',
  'Mini pão de mel': 'Com recheio de ninho, brigadeiro, coco ou doce de leite.',
  'Bolos de massa baunilha': 'Massa baunilha com recheios como maracujá, abacaxi com creme de coco, beijinho e ninho com morangos. Cobrado por kg.',
  'Bolos de massa chocolate': 'Massa chocolate com recheios como mousse de chocolate, prestígio, dois amores e ovomaltine. Cobrado por kg.',
};

export function categoryMeta(cat: string) {
  const items = PRODUCTS.filter((p) => p.category === cat);
  const first = items[0];
  return {
    id: slug(cat),
    items,
    photo: first.photo,
    desc: CATEGORY_DESC[cat],
    from: Math.min(...items.map((p) => p.price)),
    unit: first.unit,
    min: first.minGroup ? `${DOCES_MIN} doces no orçamento` : `${String(first.min).replace('.', ',')} ${first.unit}`,
  };
}
