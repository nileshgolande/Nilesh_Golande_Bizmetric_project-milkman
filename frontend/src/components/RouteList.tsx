import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface Route {
  id: string;
  name: string;
  deliveryCount: number;
  area: string;
  milkman: string;
}

const mockRoutes: Route[] = [
  {
    id: 'route1',
    name: 'North Side Route',
    deliveryCount: 15,
    area: 'Sector 1-15, Anytown',
    milkman: 'John Doe',
  },
  {
    id: 'route2',
    name: 'South Side Route',
    deliveryCount: 22,
    area: 'Sector 16-30, Anytown',
    milkman: 'Jane Smith',
  },
  {
    id: 'route3',
    name: 'Central Business District',
    deliveryCount: 8,
    area: 'Downtown, Anytown',
    milkman: 'Peter Jones',
  },
];

const RouteList: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8" role="region" aria-labelledby="delivery-routes-heading">
      <h2 id="delivery-routes-heading" className="text-2xl font-bold text-darkText dark:text-white mb-6">Delivery Routes</h2>
      {mockRoutes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No routes defined.</p>
      ) : (
        <div className="space-y-4">
          {mockRoutes.map(route => (
            <div key={route.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-darkText dark:text-white">{route.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{route.area} ({route.deliveryCount} deliveries)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {route.milkman}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteList;
