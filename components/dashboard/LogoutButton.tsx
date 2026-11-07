import { logout } from '@/app/login/actions';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="btn btn-s btn-sm">
        Sair
      </button>
    </form>
  );
}
