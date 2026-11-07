import type { Metadata } from 'next';
import { LoginForm } from '@/components/dashboard/LoginForm';

export const metadata: Metadata = { title: 'Entrar · Painel Evys Cakes', robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="pw" style={{ paddingBottom: 60 }}>
      <LoginForm />
    </main>
  );
}
