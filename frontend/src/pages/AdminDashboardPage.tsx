import React from 'react';
import DeliveriesTable from '../components/DeliveriesTable';
import RouteList from '../components/RouteList';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold text-darkText dark:text-white mb-8 text-center">Admin / Milkman Dashboard</h1>

      <DeliveriesTable />
      <RouteList />

      {/* Additional admin/milkman specific widgets can go here */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-darkText dark:text-white mb-4">Management Tools</h2>
        <p className="text-gray-600 dark:text-gray-300">Coming soon: User management, subscription management, and more.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
