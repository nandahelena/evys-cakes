'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/app/login/actions';
import { Logo } from '@/components/Logo';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);

  return (
    <form action={action} className="card" style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <Logo variant="hm" />
      </div>
      <h1 style={{ textAlign: 'center', fontSize: 28, margin: '8px 0 4px' }}>Painel da Evy</h1>
      <p className="small" style={{ textAlign: 'center' }}>
        Área restrita. Digite a senha para continuar.
      </p>

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

      <button className="btn btn-p" type="submit" disabled={pending} style={{ width: '100%', marginTop: 18 }}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
