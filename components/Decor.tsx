import { scallop } from "@/lib/scallop";

const STICKER_PATH = scallop(14, 39, 1.02, 50);

// Selo adesivo do guia de identidade (ex.: "feito à mão / com carinho").
export function Sticker({ top, bottom, className = "" }: { top: string; bottom: string; className?: string }) {
  return (
    <div className={`stk ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <path d={STICKER_PATH} fill="var(--primaria)" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="1.5 4" strokeLinecap="round" opacity=".85" />
      </svg>
      <span>
        {top}
        <small>{bottom}</small>
      </span>
    </div>
  );
}
