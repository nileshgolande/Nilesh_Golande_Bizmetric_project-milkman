import React from 'react';

interface Delivery {
  id: string;
  productName: string;
  deliveryDate: string;
  quantity: number;
  status: 'Scheduled' | 'Delivered' | 'Cancelled';
}

const mockDeliveries: Delivery[] = [
  {
    id: 'del1',
    productName: 'Premium Cow Milk',
    deliveryDate: '2026-03-03',
    quantity: 1,
    status: 'Scheduled',
  },
  {
    id: 'del2',
    productName: 'Organic Buffalo Milk',
    deliveryDate: '2026-03-05',
    quantity: 2,
    status: 'Scheduled',
  },
  {
    id: 'del3',
    productName: 'Homemade Curd',
    deliveryDate: '2026-03-07',
    quantity: 1,
    status: 'Scheduled',
  },
  {
    id: 'del4',
    productName: 'Premium Cow Milk',
    deliveryDate: '2026-03-04',
    quantity: 1,
    status: 'Delivered',
  },
];

const UpcomingDeliveries: React.FC = () => {
  const upcoming = mockDeliveries.filter(d => d.status === 'Scheduled').sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-darkText dark:text-white mb-6">Upcoming Deliveries</h2>
      {upcoming.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No upcoming deliveries scheduled.</p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((delivery) => (
            <div key={delivery.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <div>
                <p className="text-lg font-semibold text-darkText dark:text-white">{delivery.productName}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{delivery.deliveryDate} - {delivery.quantity} Litre(s)</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {delivery.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingDeliveries;
