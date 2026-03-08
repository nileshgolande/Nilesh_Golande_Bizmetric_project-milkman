import Datepicker from 'react-tailwindcss-datepicker';
import React, { useState } from 'react';
import Button from './Button';
import { products, Product } from '../services/products';

interface SubscriptionFormProps {
  initialProductId?: string;
  onSubmit: (subscriptionDetails: any) => void;
}

const deliveryTypes = [
  { label: 'Daily', value: 'daily' },
  { label: 'Alternate Days', value: 'alternate' },
  { label: 'Custom Days', value: 'custom' },
];

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  initialProductId,
  onSubmit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    initialProductId ? products.find(p => p.id === initialProductId) : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<string>(deliveryTypes[0].value);
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null
  });
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleValueChange = (newValue: any) => {
    setDateValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && quantity && deliveryType && dateValue.startDate && address.street) {
      onSubmit({
        product: selectedProduct,
        quantity,
        deliveryType,
        startDate: dateValue.startDate,
        address,
      });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Create Your Subscription</h2>

      {/* Product Selection */}
      <div>
        <label htmlFor="product-select" className="block text-lg font-semibold mb-2">Select Product</label>
        <select
          id="product-select"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
          value={selectedProduct?.id || ''}
          onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
          required
        >
          <option value="" disabled>Choose a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name} ({product.pricePerLitre}/L)</option>
          ))}
        </select>
      </div>

      {/* Quantity Selector */}
      <div>
        <label htmlFor="quantity" className="block text-lg font-semibold mb-2">Quantity (Litres per day)</label>
        <input
          type="number"
          id="quantity"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          required
        />
      </div>

      {/* Delivery Type */}
      <div>
        <span className="block text-lg font-semibold mb-2">Delivery Frequency</span>
        <div className="flex flex-wrap gap-4">
          {deliveryTypes.map(type => (
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

      {/* Start Date Picker */}
      <div>
        <label htmlFor="start-date" className="block text-lg font-semibold mb-2">Start Date</label>
        <Datepicker
          value={dateValue}
          onChange={handleValueChange}
          showShortcuts={true}
          asSingle={true}
          inputClassName="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
          toggleClassName="absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      {/* Address Selector */}
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

      <Button type="submit" variant="primary" size="large" className="w-full mt-6">
        Confirm Subscription
      </Button>
    </form>
  );
};

export default SubscriptionForm;
