type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'ok' | 'warn' | 'muted';
};

/** Cartão compacto de número (usa as cores semânticas da marca). */
export function StatCard({ label, value, hint, tone = 'default' }: Props) {
  return (
    <div className={`stat stat-${tone}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
      {hint && <small>{hint}</small>}
    </div>
  );
}
