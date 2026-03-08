import React, { useCallback, useEffect, useState } from 'react';
import Button from './Button';
import { API_BASE_URL } from '../services/products';
import { useAuth } from '../hooks/useAuth';

interface CustomerSubscription {
  id: number;
  productName: string;
  quantity: number;
  deliveryType: 'DAILY' | 'ALTERNATE' | 'CUSTOM';
  startDate: string;
  endDate?: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

interface ApiCustomerSubscription {
  id: number;
  product_name: string;
  quantity: string | number;
  delivery_type: 'DAILY' | 'ALTERNATE' | 'CUSTOM';
  start_date: string;
  end_date?: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

const formatDeliveryType = (deliveryType: CustomerSubscription['deliveryType']): string => {
  if (deliveryType === 'ALTERNATE') {
    return 'Alternate Days';
  }
  if (deliveryType === 'CUSTOM') {
    return 'Custom Days';
  }
  return 'Daily';
};

const ActiveSubscriptions: React.FC = () => {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    if (!token) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/customer/subscriptions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unable to load subscriptions (${response.status})`);
      }

      const data = (await response.json()) as ApiCustomerSubscription[];
      setSubscriptions(
        data.map((item) => ({
          id: item.id,
          productName: item.product_name,
          quantity: Number(item.quantity),
          deliveryType: item.delivery_type,
          startDate: item.start_date,
          endDate: item.end_date ?? null,
          status: item.status,
        })),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load subscriptions.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const changeSubscriptionStatus = async (subscriptionId: number, action: 'pause' | 'resume' | 'cancel') => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/customer/subscriptions/${subscriptionId}/${action}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to update subscription status.');
      }

      await loadSubscriptions();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update subscription status.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-darkText dark:text-white">My Subscriptions</h2>
        <Button type="button" size="small" variant="secondary" onClick={() => void loadSubscriptions()}>
          Refresh
        </Button>
      </div>

      {loading ? <p className="text-gray-600 dark:text-gray-300">Loading subscriptions...</p> : null}
      {errorMessage ? <p className="text-red-600 text-sm mb-4">{errorMessage}</p> : null}

      {!loading && !subscriptions.length ? (
        <p className="text-gray-600 dark:text-gray-300">No subscriptions found. Start a new subscription.</p>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
            >
              <div>
                <h3 className="text-xl font-semibold text-darkText dark:text-white mb-1">{subscription.productName}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Quantity: {subscription.quantity} Litre(s) per day</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Frequency: {formatDeliveryType(subscription.deliveryType)}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Starts: {subscription.startDate}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Ends: {subscription.endDate || 'Open'}</p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    subscription.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : subscription.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subscription.status}
                </span>

                {subscription.status === 'ACTIVE' ? (
                  <Button type="button" variant="secondary" size="small" onClick={() => void changeSubscriptionStatus(subscription.id, 'pause')}>
                    Pause
                  </Button>
                ) : null}
                {subscription.status === 'PAUSED' ? (
                  <Button type="button" variant="primary" size="small" onClick={() => void changeSubscriptionStatus(subscription.id, 'resume')}>
                    Resume
                  </Button>
                ) : null}
                {subscription.status !== 'CANCELLED' ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => void changeSubscriptionStatus(subscription.id, 'cancel')}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptions;
