import { logout } from '@/app/login/actions';

export function LogoutButton() {
  return (
    <form action={logout} className="dash-out">
      <button type="submit" className="btn btn-s btn-sm">
        Sair
      </button>
    </form>
  );
}
