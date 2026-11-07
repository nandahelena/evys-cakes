import Link from 'next/link';
import { FILTERS, type Filter } from '@/lib/dashboard/logic';

/** Filtros por status via ?f= na URL (funciona sem JavaScript). */
export function FilterChips({ current, counts }: { current: Filter; counts: Record<Filter, number> }) {
  return (
    <nav className="dash-chips" aria-label="Filtrar pedidos">
      {FILTERS.map(({ key, label }) => (
        <Link
          key={key}
          href={key === 'todos' ? '/dashboard' : `/dashboard?f=${key}`}
          aria-current={current === key ? 'true' : undefined}
          scroll={false}
        >
          {label} <span>{counts[key]}</span>
        </Link>
      ))}
    </nav>
  );
}
