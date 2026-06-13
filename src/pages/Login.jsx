import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContextBase';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đăng nhập.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-900 px-8 py-7 text-white">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded bg-white/10 flex items-center justify-center">
              <i className="fas fa-shield-alt text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Hệ thống QLQL</h1>
              <p className="text-sm text-blue-100 mt-1">Đăng nhập để tiếp tục</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={updateField}
                required
                className="w-full rounded border border-slate-300 pl-10 pr-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={updateField}
                required
                className="w-full rounded border border-slate-300 pl-10 pr-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <i className="fas fa-circle-exclamation mr-2"></i>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Đang đăng nhập
              </>
            ) : (
              <>
                <i className="fas fa-right-to-bracket mr-2"></i>
                Đăng nhập
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
