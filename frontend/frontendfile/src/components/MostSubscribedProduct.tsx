import React from 'react';
import { products } from '../services/products';

// This would typically come from an API, using mock data for now
const getMostSubscribedProduct = () => {
  const productCounts: { [key: string]: number } = {};
  // Simulate subscriptions to count most popular product
  products.forEach(product => {
    productCounts[product.name] = (productCounts[product.name] || 0) + 1; // Simplistic count
  });

  let mostSubscribedName = '';
  let maxCount = 0;

  for (const name in productCounts) {
    if (productCounts[name] > maxCount) {
      maxCount = productCounts[name];
      mostSubscribedName = name;
    }
  }

  return {
    productName: mostSubscribedName || 'N/A',
    subscriptionCount: maxCount,
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
