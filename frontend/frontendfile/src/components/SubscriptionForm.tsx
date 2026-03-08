import React, { useEffect, useState } from 'react';
import Button from './Button';
import { fetchPublicProducts } from '../services/products';
import type { Product } from '../services/products';

interface SubscriptionFormProps {
  initialProductId?: string;
  onSubmit: (subscriptionDetails: {
    product: Product;
    quantity: number;
    deliveryType: string;
    startDate: string;
    endDate: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  }) => void;
}

const deliveryTypes = [
  { label: 'Daily', value: 'daily' },
  { label: 'Alternate Days', value: 'alternate' },
];

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  initialProductId,
  onSubmit,
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<string>(deliveryTypes[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const apiProducts = await fetchPublicProducts();
        if (!mounted) {
          return;
        }
        setAvailableProducts(apiProducts);
      } catch {
        if (!mounted) {
          return;
        }
        setAvailableProducts([]);
      }
    };

    void loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (availableProducts.length === 0) {
      return;
    }
    setSelectedProduct(initialProductId ? availableProducts.find((p) => p.id === initialProductId) : undefined);
  }, [availableProducts, initialProductId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !deliveryType || !startDate || !endDate || !address.street) {
      setFormError('Please fill in all required fields including subscription date range.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End date must be after or equal to start date.');
      return;
    }

    setFormError(null);
    if (selectedProduct && quantity && deliveryType && startDate && endDate && address.street) {
      onSubmit({
        product: selectedProduct,
        quantity,
        deliveryType,
        startDate,
        endDate,
        address,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Create Your Subscription</h2>

      <div>
        <label htmlFor="product-select" className="block text-lg font-semibold mb-2">Select Product</label>
        <select
          id="product-select"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
          value={selectedProduct?.id || ''}
          onChange={(e) => setSelectedProduct(availableProducts.find((p) => p.id === e.target.value))}
          required
        >
          <option value="" disabled>Choose a product</option>
          {availableProducts.map((product) => (
            <option key={product.id} value={product.id}>{product.name} (Rs {product.pricePerLitre}/L)</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-lg font-semibold mb-2">Quantity (Litres per day)</label>
        <input
          type="number"
          id="quantity"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          min="1"
          required
        />
      </div>

      <div>
        <span className="block text-lg font-semibold mb-2">Delivery Frequency</span>
        <div className="flex flex-wrap gap-4">
          {deliveryTypes.map((type) => (
            <label key={type.value} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="deliveryType"
                value={type.value}
                checked={deliveryType === type.value}
                onChange={(e) => setDeliveryType(e.target.value)}
                aria-label={`${type.label} delivery`}
              />
              <span className="ml-2 text-darkText dark:text-white">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label htmlFor="start-date" className="block text-lg font-semibold mb-2">Subscription Date Range</label>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium mb-1">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => {
                setFormError(null);
                setStartDate(event.target.value);
                if (endDate && event.target.value > endDate) {
                  setEndDate(event.target.value);
                }
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium mb-1">End Date</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().slice(0, 10)}
              onChange={(event) => {
                setFormError(null);
                setEndDate(event.target.value);
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </div>
        <p className="md:col-span-2 text-xs text-gray-500 mt-1">Use calendar pickers to select start and end date.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
        <input
          type="text"
          placeholder="Street Address"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary mb-3"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          required
          aria-label="Street Address"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="City"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
            aria-label="City"
          />
          <input
            type="text"
            placeholder="State"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
            aria-label="State"
          />
          <input
            type="text"
            placeholder="Zip Code"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            required
            aria-label="Zip Code"
          />
        </div>
      </div>

      {formError ? (
        <div className="bg-red-100 text-red-700 text-sm rounded-md p-3">{formError}</div>
      ) : null}

      <Button type="submit" variant="primary" size="large" className="w-full mt-6">
        Confirm Subscription
      </Button>
    </form>
  );
};

export default SubscriptionForm;
