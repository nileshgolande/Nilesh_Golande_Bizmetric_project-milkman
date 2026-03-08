import React from 'react';

interface MetricsSummaryProps {
  totalSpend: number;
  deliverySuccessRate: number;
}

const mockMetrics: MetricsSummaryProps = {
  totalSpend: 15000,
  deliverySuccessRate: 99.5,
};

const MetricsSummary: React.FC = () => {
  const { totalSpend, deliverySuccessRate } = mockMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Total Spend (YTD)</p>
        <p className="text-4xl font-bold text-accent">₹{totalSpend}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Delivery Success Rate</p>
        <p className="text-4xl font-bold text-green-500">{deliverySuccessRate}%</p>
      </div>
    </div>
  );
};

export default MetricsSummary;
