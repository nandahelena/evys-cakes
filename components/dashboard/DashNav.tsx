'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/dashboard', label: 'Pedidos', match: (p: string) => p === '/dashboard' || p.startsWith('/dashboard/orders') },
  { href: '/dashboard/calendar', label: 'Calendário', match: (p: string) => p.startsWith('/dashboard/calendar') },
];

export function DashNav() {
  const pathname = usePathname();
  return (
    <nav className="dash-nav" aria-label="Seções do painel">
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} aria-current={item.match(pathname) ? 'page' : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
