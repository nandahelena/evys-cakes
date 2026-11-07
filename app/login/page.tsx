import type { Metadata } from 'next';
import { LoginForm } from '@/components/dashboard/LoginForm';
import './login.css';

export const metadata: Metadata = { title: 'Entrar · Painel Evys Cakes', robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="login">
      <LoginForm />
    </main>
  );
}
