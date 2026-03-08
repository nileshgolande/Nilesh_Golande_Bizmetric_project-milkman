import React from 'react';
import ConsumptionGraph from '../components/ConsumptionGraph';
import MetricsSummary from '../components/MetricsSummary';
import MostSubscribedProduct from '../components/MostSubscribedProduct';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold text-darkText dark:text-white mb-8 text-center">Analytics Dashboard</h1>

      <MetricsSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConsumptionGraph />
        <MostSubscribedProduct />
      </div>

      {/* Additional analytics or custom reports can go here */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-darkText dark:text-white mb-4">Detailed Reports</h2>
        <p className="text-gray-600 dark:text-gray-300">Coming soon: More in-depth analytics and custom report generation.</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
