import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { API_BASE_URL } from '../services/products';

const PasswordResetRequestPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{ uid: string; token: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.detail);
        if (data.debug_uid && data.debug_token) {
          setDebugInfo({ uid: data.debug_uid, token: data.debug_token });
        }
      } else {
        setError(data.detail || 'Failed to request password reset.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Reset Password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message ? (
          <div className="bg-green-100 text-green-700 text-sm rounded-md p-4 mb-4">
            {message}
            {debugInfo && (
              <div className="mt-4 p-2 bg-white rounded border border-green-200">
                <p className="font-bold text-xs uppercase mb-1">Debug Link (Simulation):</p>
                <Link 
                  to={`/password/reset/confirm?uid=${debugInfo.uid}&token=${debugInfo.token}`}
                  className="text-primary underline break-all text-xs"
                >
                  Click here to reset password
                </Link>
              </div>
            )}
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-100 text-red-700 text-sm rounded-md p-3 mb-4">{error}</div>
        ) : null}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="large" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login/customer" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
