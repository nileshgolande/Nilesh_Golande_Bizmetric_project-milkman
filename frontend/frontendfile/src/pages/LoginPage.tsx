import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

type LoginRole = 'STAFF' | 'CUSTOMER';

interface LoginPageProps {
  forcedRole: LoginRole;
}

const LoginPage: React.FC<LoginPageProps> = ({ forcedRole }) => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = searchParams.get('redirect') ?? '/';
  const loginTitle = forcedRole === 'STAFF' ? 'Admin Login' : 'Customer Login';
  const registerPath = forcedRole === 'STAFF' ? '/register/admin' : '/register/customer';
  const switchLoginPath = forcedRole === 'STAFF' ? '/login/customer' : '/login/admin';
  const switchLoginLabel = forcedRole === 'STAFF' ? 'Switch to Customer Login' : 'Switch to Admin Login';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email, password);

      if (forcedRole === 'STAFF' && loggedInUser.role !== 'STAFF') {
        logout();
        setError('Admin credentials are required to access this page.');
        return;
      }

      if (forcedRole === 'CUSTOMER' && loggedInUser.role !== 'CUSTOMER') {
        logout();
        setError('Customer credentials are required to access this page.');
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      const errorMessage = loginError instanceof Error ? loginError.message : 'Login failed. Please verify email and password.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">{loginTitle}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
          Please login before subscription, purchase, or admin dashboard access.
        </p>

        {error ? (
          <div className="bg-red-100 text-red-700 text-sm rounded-md p-3 mb-4">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="flex justify-end mt-1">
              <Link to="/password/reset" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
          </div>

          <Button type="submit" variant="primary" size="large" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link to={registerPath}>
            <Button type="button" variant="secondary" size="large" className="w-full">
              New Register
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          <Link to={switchLoginPath} className="text-primary hover:underline">{switchLoginLabel}</Link>
          <span className="mx-2">|</span>
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
