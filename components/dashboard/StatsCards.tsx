import { StatCard } from '@/components/ui/StatCard';
import type { Stats } from '@/lib/dashboard/logic';

/** Contadores do topo: enviados, fechados, perdidos, conversão, follow-ups e o principal motivo de perda. */
export function StatsCards({ stats }: { stats: Stats }) {
  const { sent, won, lost, conversionPct, followUps, topLossReason } = stats;

  return (
    <dl className="stats" aria-label="Resumo dos orçamentos">
      <StatCard label="Orçamentos enviados" value={String(sent)} />
      <StatCard label="Fechados" value={String(won)} tone="ok" />
      <StatCard label="Perdidos" value={String(lost)} tone="muted" />
      <StatCard
        label="Taxa de conversão"
        value={conversionPct === null ? '—' : `${conversionPct}%`}
        hint={sent ? `${won} de ${sent} orçamentos` : 'Ainda sem orçamentos'}
      />
      <StatCard
        label="Precisam de follow-up"
        value={String(followUps)}
        hint={followUps ? 'Sem resposta há mais de 2 dias' : 'Tudo em dia'}
        tone={followUps ? 'warn' : 'default'}
      />
      {topLossReason && (
        <StatCard
          label="Principal motivo de perda"
          value={topLossReason.label}
          hint={`${topLossReason.count} de ${lost} perdidos`}
          tone="muted"
        />
      )}
    </dl>
  );
}
