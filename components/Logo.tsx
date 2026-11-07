// Logo do guia de identidade: "hm" = horizontal compacto (topo), "h" = horizontal completo, "m" = só o medalhão.
const Medal = () => (
  <>
    <circle r="60" fill="none" strokeWidth="1" style={{ stroke: 'var(--md-ring,var(--primaria))' }} />
    <circle r="52" style={{ fill: 'var(--md-disc,var(--primaria))' }} />
    <use href="#cake-w" x="-60" y="-60" width="120" height="120" />
  </>
);

export function Logo({ variant = 'hm', className = '' }: { variant?: 'h' | 'hm' | 'm'; className?: string }) {
  if (variant === 'm') {
    return (
      <svg className={`logo ${className}`} viewBox="-62 -62 124 124" role="img" aria-label="Evys Cakes">
        <Medal />
      </svg>
    );
  }
  if (variant === 'hm') {
    return (
      <svg className={`logo ${className}`} viewBox="0 0 230 70" role="img" aria-label="Evys Cakes">
        <g transform="translate(35 35) scale(.56)"><Medal /></g>
        <text className="gv" x="78" y="46" fontSize="40">Evys Cakes</text>
      </svg>
    );
  }
  return (
    <svg className={`logo ${className}`} viewBox="0 0 440 150" role="img" aria-label="Evys Cakes, confeitaria artesanal">
      <g transform="translate(68 75)"><Medal /></g>
      <text className="gv" x="150" y="76" fontSize="60">Evys Cakes</text>
      <path className="lf" strokeWidth="1.1" d="M150 106H252M272 106H374" />
      <path className="fd" d="M262 101.5L266.5 106L262 110.5L257.5 106z" />
      <text className="tg" x="154" y="130">confeitaria artesanal</text>
    </svg>
  );
}
