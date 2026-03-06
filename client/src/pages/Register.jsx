import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';
import * as authService from '../services/authService.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';

export const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({
        email: form.email,
        username: form.username,
        displayName: form.displayName,
        password: form.password,
      });
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
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
          <p className="mt-2 text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} required />
          <Input label="Username" placeholder="cooluser" value={form.username} onChange={handleChange('username')} required />
          <Input label="Display Name" placeholder="Your Name" value={form.displayName} onChange={handleChange('displayName')} required />
          <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange('password')} required />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} required />

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
