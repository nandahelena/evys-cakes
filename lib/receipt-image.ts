// Desenha o recibo do orçamento (PNG 1080 px de largura) direto no navegador, com as fontes que a página já carregou.
// Modelo visual: docs/orcamento-imagem/recibo.html
export type ReceiptData = {
  code: string;
  customer: string;
  eventLabel: string; // "Aniversário"
  dateLabel: string; // "28 nov"
  dateShort: string; // "28/11"
  guests: number;
  lines: { name: string; sub: string; subtotal: string }[]; // sub: "Brigadeiro · 100 un × R$ 1,45"
  total: string;
  entradaPct: number;
  entrada: string;
  restante: string;
  until: string; // "14/11"
  daysLeft: number;
};

const C = {
  primaria: '#B83A73', escura: '#8F2A58', superficie: '#FCE4EC', linha: '#E8C4D2',
  tinta: '#33182E', tinta2: '#7C5568', urg: '#FFF0D6', urgTexto: '#7A4B00',
};
const W = 1080, PX = 80, PW = 920, CX = 140, CR = 940; // papel: x 80..1000; conteúdo: x 140..940

const cssFont = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxW) {
      out.push(line);
      line = word;
    } else line = next;
  }
  return [...out, line];
}

function render(ctx: CanvasRenderingContext2D, d: ReceiptData, f: { ft: string; fc: string; fs: string }, H: number): number {
  const txt = (s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left', spacing = '0px') => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.letterSpacing = spacing; // letterSpacing: Safari antigo ignora
    ctx.fillText(s, x, y);
  };
  const fit = (s: string, px: number, maxW: number) => { // encolhe a fonte dos valores grandes se o número for enorme
    let size = px;
    ctx.font = `700 ${size}px ${f.ft}`; ctx.letterSpacing = '0px';
    while (size > 30 && ctx.measureText(s).width > maxW) ctx.font = `700 ${--size}px ${f.ft}`;
    return size;
  };
  const dash = (y: number) => {
    ctx.setLineDash([12, 8]); ctx.strokeStyle = C.linha; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(CX, y); ctx.lineTo(CR, y); ctx.stroke(); ctx.setLineDash([]);
  };
  const box = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, 28); ctx.fill();
  };

  ctx.fillStyle = C.superficie; ctx.fillRect(0, 0, W, H);
  // papel com borda recortada (bolinhas em cima e embaixo) e sombra
  const top = 70, bottom = H - 70;
  ctx.save();
  ctx.shadowColor = 'rgba(143,42,88,.16)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.rect(PX, top, PW, bottom - top);
  for (let x = PX + 20; x < PX + PW; x += 40) {
    ctx.moveTo(x + 19, top); ctx.arc(x, top, 19, 0, Math.PI * 2);
    ctx.moveTo(x + 19, bottom); ctx.arc(x, bottom, 19, 0, Math.PI * 2);
  }
  ctx.fill(); ctx.restore();

  // logo: medalhão + nome
  ctx.font = `400 88px ${f.fs}`;
  const nameW = ctx.measureText('Evys Cakes').width;
  const mx = (W - (96 + 20 + nameW)) / 2, my = top + 64 + 48;
  ctx.save();
  ctx.translate(mx + 48, my); ctx.scale(96 / 124, 96 / 124);
  ctx.strokeStyle = C.primaria; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = C.primaria; ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.fill();
  ctx.translate(-60, -60); ctx.scale(1.2, 1.2); // bolo do medalhão (viewBox 100)
  ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.stroke(new Path2D('M31 58h38v12H31zM37 46h26v12H37zM43 36h14v10H43zM31 62q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0M37 50q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0M50 28c0-2.5 1.5-4 4-4.5M26 70h48M50 70v4M42 76h16'));
  ctx.beginPath(); ctx.arc(50, 31, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  txt('Evys Cakes', mx + 96 + 20, my + 30, `400 88px ${f.fs}`, C.primaria);
  txt(`ORÇAMENTO · Nº ${d.code}`, W / 2 + 4, top + 64 + 96 + 40, `700 24px ${f.fc}`, C.tinta2, 'center', '7px');

  let y = top + 64 + 96 + 8 + 31 + 34 + 10;
  dash(y); y += 4 + 34;

  // cliente / evento / data / convidados
  const meta = (label: string, value: string, x: number, align: CanvasTextAlign, yy: number) => {
    txt(label.toUpperCase(), x, yy + 22, `700 24px ${f.fc}`, C.tinta2, align, '3px');
    txt(value, x, yy + 68, `700 42px ${f.ft}`, C.tinta, align);
  };
  meta('Cliente', d.customer.split(' ')[0], CX, 'left', y);
  meta('Evento', d.eventLabel, CR, 'right', y);
  meta('Data', d.dateLabel, CX, 'left', y + 99);
  meta('Convidados · Entrega', `${d.guests} · Retirada`, CR, 'right', y + 99);
  y += 178 + 34;
  dash(y); y += 4 + 34;

  // itens
  for (const l of d.lines) {
    y += 14;
    const base = y + 32;
    ctx.font = `500 29px ${f.fc}`;
    const sub = wrap(ctx, l.sub, 560);
    ctx.letterSpacing = '0px';
    ctx.font = `700 36px ${f.fc}`;
    const nameW2 = Math.min(560, ctx.measureText(l.name).width);
    txt(l.name, CX, base, `700 36px ${f.fc}`, C.tinta);
    ctx.font = `700 38px ${f.ft}`;
    const vW = ctx.measureText(l.subtotal).width;
    txt(l.subtotal, CR, base, `700 38px ${f.ft}`, C.tinta, 'right');
    sub.forEach((s, i) => txt(s, CX, base + 34 + 36 * i, `500 29px ${f.fc}`, C.tinta2));
    ctx.font = `500 29px ${f.fc}`;
    const subW = Math.max(...sub.map((s) => ctx.measureText(s).width));
    const x0 = CX + Math.max(nameW2, subW) + 16, x1 = CR - vW - 16;
    if (x1 - x0 > 30) {
      ctx.setLineDash([1, 10]); ctx.lineCap = 'round'; ctx.strokeStyle = C.linha; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x0, base - 8); ctx.lineTo(x1, base - 8); ctx.stroke(); ctx.setLineDash([]);
    }
    y = base + 34 + 36 * (sub.length - 1) + 14 + 10;
  }
  y += 10;
  dash(y); y += 4 + 34;

  // total, entrada e restante
  txt('TOTAL', CX, y + 78, `700 38px ${f.fc}`, C.tinta, 'left', '4px');
  const ts = fit(d.total, 98, 560);
  txt(d.total, CR, y + 78, `700 ${ts}px ${f.ft}`, C.primaria, 'right');
  y += 100 + 22;
  box(CX, y, 800, 128, C.superficie);
  txt(`Entrada para reservar (${Math.round(d.entradaPct * 100)}%)`, CX + 30, y + 52, `700 34px ${f.fc}`, C.escura);
  txt('Pix, cartão ou dinheiro', CX + 30, y + 90, `500 28px ${f.fc}`, C.escura);
  ctx.font = `700 34px ${f.fc}`;
  const es = fit(d.entrada, 60, 740 - ctx.measureText('Entrada para reservar (60%)').width - 20);
  txt(d.entrada, CR - 30, y + 80, `700 ${es}px ${f.ft}`, C.escura, 'right');
  y += 128 + 16;
  txt('Restante, na retirada', CX + 30, y + 32, `500 32px ${f.fc}`, C.tinta2);
  txt(d.restante, CR - 30, y + 32, `500 32px ${f.fc}`, C.tinta2, 'right');
  y += 42 + 34;

  // validade
  box(CX, y, 800, 130, C.urg);
  ctx.save();
  ctx.translate(CX + 30, y + 38); ctx.scale(54 / 48, 54 / 48);
  ctx.strokeStyle = C.urgTexto; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(24, 25, 16, 0, Math.PI * 2); ctx.stroke(); ctx.stroke(new Path2D('M24 15v10l7 4M19 5h10M35 9l3 3'));
  ctx.restore();
  const left = d.daysLeft === 1 ? 'falta 1 dia' : `faltam ${d.daysLeft} dias`;
  txt(`Válido até ${d.until} · ${left}`, CX + 102, y + 52, `700 36px ${f.fc}`, C.urgTexto);
  txt(`Pague a entrada até lá para garantir o dia ${d.dateShort}.`, CX + 102, y + 92, `500 28px ${f.fc}`, C.urgTexto);
  y += 130 + 34;

  // chamada + rodapé
  txt('Para reservar a data, é só pagar a entrada.', W / 2, y + 34, `700 34px ${f.fc}`, C.primaria, 'center');
  txt('Desistência: a entrada não é devolvida.', W / 2, y + 80, `500 28px ${f.fc}`, C.tinta2, 'center');
  y += 80 + 40;
  txt('Evy', W / 2, y + 44, `400 52px ${f.fs}`, C.primaria, 'center');
  txt('Evelyn Guimarães · confeitaria artesanal', W / 2, y + 44 + 38, `500 26px ${f.fc}`, C.tinta2, 'center');
  return y + 44 + 38 + 8 + 44; // fim do papel (+ margem do papel)
}

export async function drawReceipt(d: ReceiptData): Promise<Blob> {
  const f = { ft: cssFont('--ft'), fc: cssFont('--fc'), fs: cssFont('--fs') };
  await Promise.all([`700 38px ${f.ft}`, `700 36px ${f.fc}`, `500 29px ${f.fc}`, `400 88px ${f.fs}`].map((s) => document.fonts.load(s)));
  const measure = document.createElement('canvas');
  const H = render(measure.getContext('2d')!, d, f, 4000) + 70; // 1ª passada só mede a altura
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  render(canvas.getContext('2d')!, d, f, H);
  return new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error('canvas vazio'))), 'image/png'));
}
