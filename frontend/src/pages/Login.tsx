import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, Pill } from 'lucide-react';

const FIELDS = {
  email: 'email',
  password: 'password',
} as const;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const user = await authService.login({ email, password });
      login(user);
      navigate(from, { replace: true });
    } catch {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Pill className="h-7 w-7 text-emerald-600" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            Pharmacy
          </span>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Đăng nhập</h1>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor={FIELDS.email} className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id={FIELDS.email}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor={FIELDS.password} className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                id={FIELDS.password}
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-md py-2.5 px-4 font-medium text-sm hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-emerald-600 font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
