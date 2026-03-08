import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, UserIcon, ChartBarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const MobileBottomNavigation: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darkText shadow-lg md:hidden z-50 transition-colors duration-300">
      <div className="flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Home">
          <HomeIcon className="h-6 w-6" />
          Home
        </Link>
        <Link to="/products" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Products">
          <ShoppingBagIcon className="h-6 w-6" />
          Products
        </Link>
        {user?.role !== 'STAFF' ? (
          <Link to="/subscribe" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Subscribe">
            <CalendarDaysIcon className="h-6 w-6" />
            Subscribe
          </Link>
        ) : null}
        {user?.role === 'STAFF' ? (
          <Link to="/admin" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Dashboard">
            <UserIcon className="h-6 w-6" />
            Admin
          </Link>
        ) : (
          <Link to="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Dashboard">
            <UserIcon className="h-6 w-6" />
            Dashboard
          </Link>
        )}
        <Link to="/analytics" className="flex flex-col items-center text-gray-500 hover:text-primary text-xs dark:text-gray-400 dark:hover:text-primary transition-colors duration-300" title="Analytics">
          <ChartBarIcon className="h-6 w-6" />
          Analytics
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;
