import type { CSSProperties } from 'react';
import { scallop } from '@/lib/scallop';

// Ícones e padrão de doodles do guia de identidade. Renderizado uma vez no layout; os outros componentes usam <use href="#i-...">.
const flat = { '--ia': 'none', '--ib': 'none', '--ic': 'none', '--id': 'none' } as CSSProperties;

export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="clip-sc" clipPathUnits="objectBoundingBox">
          <path d={scallop(14, 0.4, 1.02, 0.5)} />
        </clipPath>
        <symbol id="cake-w" viewBox="0 0 100 100">
          <g fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--md-ink,#fff)' }}>
            <rect x="31" y="58" width="38" height="12" rx="2" /><rect x="37" y="46" width="26" height="12" rx="2" /><rect x="43" y="36" width="14" height="10" rx="2" />
            <path d="M31 62q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0M37 50q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0" />
            <circle cx="50" cy="31" r="3.2" stroke="none" style={{ fill: 'var(--md-ink,#fff)' }} /><path d="M50 28c0-2.5 1.5-4 4-4.5" />
            <path d="M26 70h48M50 70v4M42 76h16" />
          </g>
        </symbol>

        <symbol className="i" id="i-cake" viewBox="0 0 48 48">
          <g transform="translate(-11 -11) scale(.7)" strokeWidth="3.4">
            <rect className="ia" x="31" y="58" width="38" height="12" rx="2" /><rect className="ib" x="37" y="46" width="26" height="12" rx="2" /><rect className="ia" x="43" y="36" width="14" height="10" rx="2" />
            <path d="M31 62q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0q4.75 5 9.5 0M37 50q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0q3.25 4 6.5 0" />
            <circle className="id" cx="50" cy="31" r="3.6" /><path d="M50 27.5c0-2.5 1.5-4 4-4.5" /><path d="M26 70h48M50 70v4M42 76h16" />
          </g>
        </symbol>
        <symbol className="i" id="i-cupcake" viewBox="0 0 48 48">
          <path className="ia" d="M11 25h26l-3 17H14z" /><path d="M19 25l1.2 17M24 25v17M29 25l-1.2 17" />
          <path className="ic" d="M10 25C5 25 5 18 11 18C10 13 16 11 19 13C20 8 28 8 29 13C34 11 39 15 36 18C41 19 41 25 37 25z" />
          <circle className="id" cx="24" cy="6.5" r="3.4" /><path d="M24 4c0-2 2-3 3.5-3" />
        </symbol>
        <symbol className="i" id="i-brig" viewBox="0 0 48 48">
          <circle className="ib" cx="24" cy="21" r="11.5" /><path d="M18 16l2 1.5M27 14l1.5 2M30 22l2 1M17 24l1.5-1.5M24 27l.5 2.5" />
          <path className="ia" d="M9 31q2-4.5 4 0q2-4.5 4 0q2-4.5 4 0q2-4.5 4 0q2-4.5 4 0q2-4.5 4 0q2-4.5 4 0L34.5 43h-21z" /><path d="M18 34l.8 8M24 34v8M30 34l-.8 8" />
        </symbol>
        <symbol className="i" id="i-cherry" viewBox="0 0 48 48">
          <circle className="id" cx="15" cy="34" r="8" /><circle className="id" cx="33" cy="32" r="8" /><path d="M15 26C17 16 22 10 30 6M33 24C33 16 31 10 30 6" />
          <path className="ib" d="M30 6c4-3 10-2 13 1c-3 4-9 5-13-1z" />
        </symbol>
        <symbol className="i" id="i-pao" viewBox="0 0 48 48">
          <path className="ib" d="M7 28C7 14 41 14 41 28z" /><path className="ia" d="M9 28h30v3a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" />
          <path className="ib" d="M12 34h24v1a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5z" /><path d="M16 22q3-3 7-3" stroke="#fff" opacity=".8" />
        </symbol>
        <symbol className="i" id="i-topper" viewBox="0 0 48 48">
          <path className="id" d="M24 3l3.5 8 8.7.8-6.6 5.8 2 8.5L24 21.5 16.4 26l2-8.5-6.6-5.8 8.7-.8z" /><path d="M24 26v17M19 43h10" />
        </symbol>
        <symbol className="i" id="i-bow" viewBox="0 0 48 48">
          <path className="ib" d="M24 24C16 12 5 14 7 24C5 34 16 36 24 24C32 36 43 34 41 24C43 14 32 12 24 24z" /><path className="id" d="M20.5 20h7v8h-7z" /><path d="M22 28l-5 13M26 28l5 13" />
        </symbol>
        <symbol className="i" id="i-heart" viewBox="0 0 48 48"><path className="id" d="M24 41C8 29 5 17 13 11.5C18.5 8 23 11 24 15.5C25 11 29.5 8 35 11.5C43 17 40 29 24 41z" /></symbol>
        <symbol className="i" id="i-spark" viewBox="0 0 48 48">
          <path className="ib" d="M22 5Q24 20 39 22Q24 24 22 39Q20 24 5 22Q20 20 22 5z" /><path className="id" d="M38 30q1 5 5 6q-4 1-5 6q-1-5-5-6q4-1 5-6z" strokeWidth="1.8" />
        </symbol>
        <symbol className="i" id="i-cal" viewBox="0 0 48 48">
          <rect x="7" y="10" width="34" height="31" rx="6" /><path className="ib" d="M7 16a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v5H7z" /><path d="M16 6v7M32 6v7" />
          <path className="id" d="M24 36c-5-3.5-7-6-7-8.5a3.5 3.5 0 0 1 7-1a3.5 3.5 0 0 1 7 1c0 2.5-2 5-7 8.5z" strokeWidth="1.8" />
        </symbol>
        <symbol className="i" id="i-clock" viewBox="0 0 48 48"><circle className="ia" cx="24" cy="25" r="16" /><path d="M24 15v10l7 4" /><path d="M19 5h10M35 9l3 3" /></symbol>
        <symbol className="i" id="i-chat" viewBox="0 0 48 48">
          <path className="ia" d="M24 7C14 7 6 14 6 23c0 4 1.5 7.5 4 10l-2 8 8.5-3c2.3.8 4.7 1.2 7.5 1.2C34 39 42 32 42 23S34 7 24 7z" /><path className="id" d="M16.5 24h.1M24 24h.1M31.5 24h.1" strokeWidth="4" />
        </symbol>
        <symbol className="i" id="i-check" viewBox="0 0 48 48"><circle className="ia" cx="24" cy="25" r="17" /><path d="M15.5 25l6 6 11-13" /></symbol>
        <symbol className="i" id="i-share" viewBox="0 0 48 48"><circle className="ia" cx="12" cy="24" r="6" /><circle className="ia" cx="35" cy="11" r="6" /><circle className="ia" cx="35" cy="37" r="6" /><path d="M17 21l13-7M17 27l13 7" /></symbol>
        <symbol className="i" id="i-list" viewBox="0 0 48 48"><rect className="ia" x="9" y="6" width="30" height="36" rx="5" /><path d="M16 17h16M16 25h16M16 33h9" /></symbol>
        <symbol className="i" id="i-menu" viewBox="0 0 48 48"><path className="ia" d="M8 18h32v20a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" /><path d="M8 18c0-8 8-12 16-12s16 4 16 12" /><path d="M24 6v-1" /></symbol>
        <symbol className="i" id="i-chev" viewBox="0 0 48 48"><path d="M12 18l12 12 12-12" /></symbol>

        <pattern id="pat-doodle" width="210" height="210" patternUnits="userSpaceOnUse" style={{ color: 'var(--suave)', ...flat }}>
          <use href="#i-cake" x="12" y="10" width="50" height="50" transform="rotate(-8 37 35)" />
          <use href="#i-cupcake" x="118" y="10" width="46" height="46" transform="rotate(10 141 33)" />
          <use href="#i-spark" x="70" y="78" width="30" height="30" />
          <use href="#i-pao" x="12" y="124" width="46" height="46" />
          <use href="#i-brig" x="112" y="112" width="46" height="46" transform="rotate(12 135 135)" />
          <use href="#i-topper" x="168" y="62" width="34" height="34" transform="rotate(18 185 79)" />
          <use href="#i-heart" x="80" y="164" width="26" height="26" transform="rotate(-12 93 177)" />
          <use href="#i-cherry" x="168" y="164" width="32" height="32" />
          <use href="#i-bow" x="70" y="24" width="28" height="28" transform="rotate(14 84 38)" />
        </pattern>
      </defs>
    </svg>
  );
}

export function Doodles({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <rect width="100%" height="100%" fill="url(#pat-doodle)" />
    </svg>
  );
}
