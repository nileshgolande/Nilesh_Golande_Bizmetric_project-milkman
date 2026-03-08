import React, { useState } from 'react';
import Button from './Button';

interface Subscription {
  id: string;
  productName: string;
  quantityPerDay: number;
  deliveryFrequency: string;
  startDate: string;
  status: 'active' | 'paused';
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    productName: 'Premium Cow Milk',
    quantityPerDay: 1,
    deliveryFrequency: 'Daily',
    startDate: '2026-03-01',
    status: 'active',
  },
  {
    id: 'sub2',
    productName: 'Organic Buffalo Milk',
    quantityPerDay: 2,
    deliveryFrequency: 'Alternate Days',
    startDate: '2026-03-05',
    status: 'active',
  },
  {
    id: 'sub3',
    productName: 'Homemade Curd',
    quantityPerDay: 1,
    deliveryFrequency: 'Weekly',
    startDate: '2026-02-15',
    status: 'paused',
  },
];

const ActiveSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  const toggleSubscriptionStatus = (id: string) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === id
          ? { ...sub, status: sub.status === 'active' ? 'paused' : 'active' }
          : sub
      )
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-darkText dark:text-white mb-6">Active Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No active subscriptions found. Start a new one today!</p>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div>
                <h3 className="text-xl font-semibold text-darkText dark:text-white mb-1">{sub.productName}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Quantity: {sub.quantityPerDay} Litre(s) per day</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Frequency: {sub.deliveryFrequency}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Starts: {sub.startDate}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </span>
                <Button
                  variant={sub.status === 'active' ? 'secondary' : 'primary'}
                  size="small"
                  onClick={() => toggleSubscriptionStatus(sub.id)}
                >
                  {sub.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptions;
