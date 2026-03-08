import React from 'react';

// This would typically come from an API, using an empty state for now
const getMostSubscribedProduct = () => {
  return {
    productName: 'N/A',
    subscriptionCount: 0,
  };
};

const MostSubscribedProduct: React.FC = () => {
  const { productName, subscriptionCount } = getMostSubscribedProduct();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-darkText dark:text-white mb-4">Most Subscribed Product</h2>
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Product Name</p>
        <p className="text-3xl font-bold text-primary">{productName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">Total Subscriptions</p>
        <p className="text-2xl font-semibold text-accent">{subscriptionCount}</p>
      </div>
    </div>
  );
};

export default MostSubscribedProduct;
