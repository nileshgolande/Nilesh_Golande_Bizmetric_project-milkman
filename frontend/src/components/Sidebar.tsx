import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BellIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Subscriptions', icon: DocumentTextIcon, path: '/dashboard/subscriptions' },
    { name: 'Deliveries', icon: BellIcon, path: '/dashboard/deliveries' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out
        md:relative md:h-auto md:shadow-none
      `}
    >
      <div className="flex items-center justify-between p-4 md:hidden">
        <h2 className="text-xl font-bold text-primary">Dashboard Menu</h2>
        <button onClick={toggleSidebar} className="text-darkText dark:text-white focus:outline-none">
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <nav className="mt-5">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-darkText dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors duration-200
                  ${isActive ? 'bg-primary text-white dark:bg-primary dark:text-white' : ''}`
                }
                onClick={toggleSidebar} // Close sidebar on link click in mobile
              >
                <link.icon className="h-6 w-6 mr-3" />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
