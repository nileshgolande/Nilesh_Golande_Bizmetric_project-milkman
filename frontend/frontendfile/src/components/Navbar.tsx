import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-darkText shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Milkman App
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {/* Desktop navigation links */}
          <Link to="/" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Home</Link>
          <Link to="/products" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Products</Link>
          {user?.role !== 'STAFF' ? (
            <Link to="/subscribe" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Subscribe</Link>
          ) : null}
          {user?.role === 'CUSTOMER' ? (
            <Link to="/dashboard" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">My Subscriptions</Link>
          ) : null}
          {user?.role === 'STAFF' ? (
            <Link to="/admin" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Admin Dashboard</Link>
          ) : null}
          {isAuthenticated ? (
            <>
              {user?.role === 'CUSTOMER' ? (
                <span className="text-darkText dark:text-white transition-colors duration-300">
                  {user.name} Login
                </span>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="text-darkText dark:text-white hover:text-primary transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login/customer" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Login</Link>
            </>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleTheme} className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary mr-2">
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 text-xs">
              <Link to="/login/customer" className="text-darkText dark:text-white hover:text-primary">Login</Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {user?.role === 'CUSTOMER' ? (
                <span className="text-darkText dark:text-white text-xs">{user.name} Login</span>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="text-darkText dark:text-white text-sm hover:text-primary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
