import { LogoutButton } from '@/components/dashboard/LogoutButton';

// Provisório (Passo 1): confirma o login. A lista de pedidos entra no Passo 4.
export default function DashboardPage() {
  return (
    <main className="pw" style={{ paddingBottom: 60 }}>
      <h1>Painel da Evy</h1>
      <p className="lead">Você está logada. Os pedidos aparecem aqui em breve.</p>
      <LogoutButton />
    </main>
  );
}
