import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/Logo';
import { DashNav } from '@/components/dashboard/DashNav';
import { ToastProvider } from '@/components/ui/Toast';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import './dashboard.css';

export const metadata: Metadata = { title: 'Painel · Evys Cakes', robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <ToastProvider>
    <div className="dash">
      <header className="dash-top">
        <div className="dash-w dash-top-in">
          <div className="dash-brand">
            <Logo variant="m" />
            <span>Evys Cakes · Painel</span>
          </div>
          {/* usePathname() é dado de requisição: precisa de Suspense. O fallback mostra os mesmos links, sem a aba ativa. */}
          <Suspense
            fallback={
              <nav className="dash-nav" aria-label="Seções do painel">
                <Link href="/dashboard">Pedidos</Link>
                <Link href="/dashboard/calendar">Calendário</Link>
              </nav>
            }
          >
            <DashNav />
          </Suspense>
          <LogoutButton />
        </div>
      </header>
      <main className="dash-w dash-main">{children}</main>
    </div>
    </ToastProvider>
  );
}
