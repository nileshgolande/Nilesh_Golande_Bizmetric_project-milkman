import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ActiveSubscriptions from '../components/ActiveSubscriptions';
import UpcomingDeliveries from '../components/UpcomingDeliveries';
import MonthlySummary from '../components/MonthlySummary';
import { Bars3Icon } from '@heroicons/react/24/outline';

const UserDashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-darkText dark:text-white"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        <h1 className="text-4xl font-bold text-darkText dark:text-white mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ActiveSubscriptions />
            <UpcomingDeliveries />
          </div>
          <div>
            <MonthlySummary />
            {/* Placeholder for other dashboard widgets */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-darkText dark:text-white mb-4">Quick Actions</h2>
              <p className="text-gray-600 dark:text-gray-300">More features coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
