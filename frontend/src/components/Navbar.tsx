import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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
          <Link to="/subscribe" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Subscribe</Link>
          <Link to="/dashboard/subscriptions" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">My Subscriptions</Link>
          <Link to="/admin" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Admin Dashboard</Link>
          <Link to="/contact" className="text-darkText dark:text-white hover:text-primary transition-colors duration-300">Contact</Link>
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
          {/* Mobile menu button */}
          <button className="text-darkText dark:text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
