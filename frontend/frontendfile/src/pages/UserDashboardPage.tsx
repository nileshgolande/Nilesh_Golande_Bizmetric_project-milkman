import React from 'react';
import ActiveSubscriptions from '../components/ActiveSubscriptions';

const UserDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightBg dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-darkText dark:text-white mb-8">My Subscriptions</h1>
        <div className="max-w-4xl">
          <ActiveSubscriptions />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
