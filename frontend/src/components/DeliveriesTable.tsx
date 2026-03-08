import React, { useState } from 'react';
import Button from './Button';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DeliveryItem {
  id: string;
  customerName: string;
  address: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Delivered' | 'Skipped';
}

const mockDeliveries: DeliveryItem[] = [
  {
    id: 'd1',
    customerName: 'Alice Smith',
    address: '123 Main St, Anytown',
    product: 'Cow Milk',
    quantity: 1,
    status: 'Pending',
  },
  {
    id: 'd2',
    customerName: 'Bob Johnson',
    address: '456 Oak Ave, Anytown',
    product: 'Buffalo Milk',
    quantity: 2,
    status: 'Pending',
  },
  {
    id: 'd3',
    customerName: 'Charlie Brown',
    address: '789 Pine Ln, Anytown',
    product: 'Flavoured Milk',
    quantity: 1,
    status: 'Delivered',
  },
  {
    id: 'd4',
    customerName: 'Diana Prince',
    address: '101 Elm Rd, Anytown',
    product: 'Curd',
    quantity: 1,
    status: 'Pending',
  },
];

const DeliveriesTable: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(mockDeliveries);

  const toggleDeliveryStatus = (id: string, currentStatus: DeliveryItem['status']) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === id
          ? { ...delivery, status: currentStatus === 'Pending' ? 'Delivered' : 'Pending' } // Simple toggle for now
          : delivery
      )
    );
  };

  const getStatusBadge = (status: DeliveryItem['status']) => {
    let colorClass = '';
    let icon = null;
    switch (status) {
      case 'Pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        icon = <XCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case 'Delivered':
        colorClass = 'bg-green-100 text-green-800';
        icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
        break;
      case 'Skipped':
        colorClass = 'bg-red-100 text-red-800';
        icon = <XCircleIcon className="h-4 w-4 mr-1" />;
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`${colorClass} text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center`}>
        {icon} {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-darkText dark:text-white mb-6">Today's Deliveries</h2>

      {deliveries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No deliveries scheduled for today.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Address</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-darkText dark:text-white">{delivery.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{delivery.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{delivery.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{delivery.quantity} L</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(delivery.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant={delivery.status === 'Pending' ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => toggleDeliveryStatus(delivery.id, delivery.status)}
                    disabled={delivery.status === 'Skipped'} // Can't toggle if skipped
                    aria-label={`Mark delivery for ${delivery.customerName} as ${delivery.status === 'Pending' ? 'Delivered' : 'Pending'}`}
                  >
                    {delivery.status === 'Pending' ? 'Mark Delivered' : 'Mark Pending'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveriesTable;
