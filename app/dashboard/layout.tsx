import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import { DashNav } from '@/components/dashboard/DashNav';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import './dashboard.css';

export const metadata: Metadata = { title: 'Painel · Evys Cakes', robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="dash">
      <header className="dash-top">
        <div className="dash-w dash-top-in">
          <div className="dash-brand">
            <Logo variant="m" />
            <span>Evys Cakes · Painel</span>
          </div>
          <DashNav />
          <LogoutButton />
        </div>
      </header>
      <main className="dash-w dash-main">{children}</main>
    </div>
  );
}
