import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';
import * as authService from '../services/authService.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold text-white">
            Mood<span className="text-purple-400">ay</span>
          </Link>
          <p className="mt-2 text-gray-400">Tekrar hoş geldin</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <Input
            label="E-posta"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="Şifreni gir"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Giriş Yap
          </Button>

          <p className="text-center text-sm text-gray-400">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300">
              Kayıt ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
