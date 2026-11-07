'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/app/login/actions';
import { Logo } from '@/components/Logo';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);

  return (
    <form action={action} className="login-card">
      <Logo variant="hm" className="login-logo" />
      <h1>Painel da Evy</h1>
      <p className="login-lead">Área restrita. Digite a senha para continuar.</p>

      <label className="field">
        Senha
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </label>

      {state.error && (
        <p id="login-error" className="err" role="alert">
          {state.error}
        </p>
      )}

      <button className="btn btn-p" type="submit" disabled={pending}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
