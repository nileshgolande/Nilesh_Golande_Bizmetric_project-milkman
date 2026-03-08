import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import { API_BASE_URL } from '../services/products';

type RegisterRole = 'CUSTOMER' | 'STAFF';

const extractErrorMessage = (errorData: unknown): string => {
  if (!errorData || typeof errorData !== 'object') {
    return 'Registration failed. Please check your details.';
  }

  const data = errorData as Record<string, unknown>;

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data.non_field_errors === 'string' && data.non_field_errors.trim()) {
    return data.non_field_errors;
  }

  if (Array.isArray(data.non_field_errors) && typeof data.non_field_errors[0] === 'string') {
    return data.non_field_errors[0];
  }

  for (const value of Object.values(data)) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return 'Registration failed. Please check your details.';
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role?: string }>();
  const [registerRole, setRegisterRole] = useState<RegisterRole>('CUSTOMER');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [adminSetupKey, setAdminSetupKey] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const routeRole = role?.toLowerCase() === 'admin' ? 'STAFF' : role?.toLowerCase() === 'customer' ? 'CUSTOMER' : undefined;
  const requiredRole = routeRole;
  const canRegisterCustomer = requiredRole !== 'STAFF';
  const canRegisterAdmin = requiredRole !== 'CUSTOMER';
  const isAdminRegister = registerRole === 'STAFF';
  const registerUrl = isAdminRegister
    ? `${API_BASE_URL}/api/v1/auth/admin/setup/`
    : `${API_BASE_URL}/api/v1/auth/customer/register/`;
  const registerTitle = requiredRole === 'STAFF' ? 'Admin Register' : requiredRole === 'CUSTOMER' ? 'Customer Register' : 'Register';
  const loginPath = requiredRole === 'STAFF' ? '/login/admin' : '/login/customer';

  useEffect(() => {
    if (requiredRole === 'STAFF') {
      setRegisterRole('STAFF');
    } else if (requiredRole === 'CUSTOMER') {
      setRegisterRole('CUSTOMER');
    }
  }, [requiredRole]);

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationMessage(null);
    setRegistrationError(null);
    setIsRegistering(true);

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          mobile: registerPhone,
          address: registerAddress,
          password: registerPassword,
          ...(isAdminRegister ? { setup_key: adminSetupKey } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setRegistrationError(extractErrorMessage(errorData));
        return;
      }

      setRegistrationMessage(
        registerRole === 'STAFF'
          ? 'Admin registered successfully. Redirecting to login...'
          : 'Customer registered successfully. Redirecting to login...',
      );

      setTimeout(() => {
        navigate(loginPath, { replace: true });
      }, 1200);
    } catch {
      setRegistrationError('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">{registerTitle}</h1>

        <div className="flex gap-2 mb-4">
          {canRegisterCustomer ? (
            <button
              type="button"
              onClick={() => setRegisterRole('CUSTOMER')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                registerRole === 'CUSTOMER'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent border-gray-300 dark:border-gray-600'
              }`}
            >
              Customer
            </button>
          ) : null}
          {canRegisterAdmin ? (
            <button
              type="button"
              onClick={() => setRegisterRole('STAFF')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                registerRole === 'STAFF'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent border-gray-300 dark:border-gray-600'
              }`}
            >
              Admin
            </button>
          ) : null}
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={registerName}
            onChange={(event) => setRegisterName(event.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(event) => setRegisterEmail(event.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={registerPhone}
            onChange={(event) => setRegisterPhone(event.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={registerAddress}
            onChange={(event) => setRegisterAddress(event.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          {isAdminRegister ? (
            <input
              type="text"
              placeholder="Admin Setup Key"
              value={adminSetupKey}
              onChange={(event) => setAdminSetupKey(event.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          ) : null}

          {registrationError ? (
            <div className="bg-red-100 text-red-700 text-sm rounded-md p-3">{registrationError}</div>
          ) : null}
          {registrationMessage ? (
            <div className="bg-green-100 text-green-700 text-sm rounded-md p-3">{registrationMessage}</div>
          ) : null}

          <Button type="submit" variant="secondary" size="large" className="w-full" disabled={isRegistering}>
            {isRegistering ? 'Registering...' : `Register as ${registerRole === 'STAFF' ? 'Admin' : 'Customer'}`}
          </Button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          <Link to={loginPath} className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
