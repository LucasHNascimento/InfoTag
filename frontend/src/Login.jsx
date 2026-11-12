import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig';
import './Login.css';

function loginErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/app-not-authorized':
    case 'auth/unauthorized-domain':
    case 'auth/configuration-not-found':
      return 'O serviço de login não está configurado corretamente. Entre em contato com o administrador.';
    case 'auth/operation-not-allowed':
      return 'O acesso por e-mail e senha ainda não foi habilitado. Entre em contato com o administrador.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
      return 'E-mail ou senha inválidos.';
    case 'auth/user-disabled':
      return 'Esta conta está desativada. Entre em contato com o administrador.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas de acesso. Aguarde alguns minutos antes de tentar novamente.';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao serviço de login. Verifique sua conexão.';
    default:
      return 'Não foi possível entrar. Tente novamente mais tarde.';
  }
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Falha no login:', err.code);
      setError(loginErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Administrador</h2>
      <p className="login-subtitle">Acesso ao Dashboard</p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="login-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
