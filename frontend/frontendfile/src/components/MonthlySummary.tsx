import React from 'react';

interface MonthlySummaryProps {
  totalConsumptionLiters: number;
  totalSpend: number;
  deliverySuccessRate: number; // percentage
}

const mockMonthlySummary: MonthlySummaryProps = {
  totalConsumptionLiters: 35,
  totalSpend: 2100,
  deliverySuccessRate: 98,
};

const MonthlySummary: React.FC = () => {
  const { totalConsumptionLiters, totalSpend, deliverySuccessRate } = mockMonthlySummary;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-darkText dark:text-white mb-6">Monthly Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Consumption</p>
          <p className="text-3xl font-bold text-primary">{totalConsumptionLiters} L</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Spend</p>
          <p className="text-3xl font-bold text-accent">₹{totalSpend}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Delivery Success Rate</p>
          <p className="text-3xl font-bold text-green-500">{deliverySuccessRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
