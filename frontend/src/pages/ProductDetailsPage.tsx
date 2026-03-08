import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../services/products';
import Button from '../components/Button';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<typeof products[0] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const fetchedProduct = products.find(p => p.id === id);
      setProduct(fetchedProduct);
      setLoading(false);
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Skeleton */}
          <div className="flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px]">
            <LoadingSkeleton width="w-full" height="h-full" />
          </div>

          {/* Product Details Skeleton */}
          <div className="flex flex-col justify-between">
            <div>
              <LoadingSkeleton width="w-3/4" height="h-10" className="mb-3" />
              <LoadingSkeleton width="w-1/4" height="h-6" className="mb-4" />
              <LoadingSkeleton height="h-20" className="mb-6" />

              {/* Nutrition Highlights Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <LoadingSkeleton width="w-1/2" height="h-8" className="mb-4" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <LoadingSkeleton width="w-1/3" height="h-8" />
                <LoadingSkeleton width="w-1/4" height="h-6" />
              </div>
            </div>

            {/* Quantity Selector and Subscribe Button Skeleton */}
            <div className="mt-8 md:mt-0">
              <LoadingSkeleton height="h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-darkText dark:text-white min-h-screen">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
      </div>
    );
  }

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <img src={product.image} alt={product.name} className="max-h-[500px] object-contain rounded-lg" />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-primary text-xl font-semibold mb-4">{product.category}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{product.description}</p>

            {/* Nutrition Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Nutrition Highlights (per 100ml/g)</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
                <p>Calories: <span className="font-semibold">{product.nutrition.calories} kcal</span></p>
                <p>Protein: <span className="font-semibold">{product.nutrition.protein} g</span></p>
                <p>Fat: <span className="font-semibold">{product.nutrition.fat} g</span></p>
                <p>Carbs: <span className="font-semibold">{product.nutrition.carbs} g</span></p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-darkText dark:text-white">₹{product.pricePerLitre} / Litre</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' : product.availability === 'Limited Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {product.availability}
              </span>
            </div>
          </div>

          {/* Quantity Selector and Subscribe Button */}
          <div className="mt-8 md:mt-0">
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="text-xl font-semibold mr-4">Quantity (Litres):</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <Button variant="secondary" size="small" onClick={() => handleQuantityChange('decrement')} className="rounded-r-none border-r-0" aria-label="Decrease quantity">
                  <MinusIcon className="h-5 w-5" />
                </Button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-xl bg-transparent focus:outline-none dark:text-white"
                  min="1"
                  aria-live="polite"
                />
                <Button variant="secondary" size="small" onClick={() => handleQuantityChange('increment')} className="rounded-l-none border-l-0" aria-label="Increase quantity">
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <Link to={`/subscribe/${product.id}`}><Button variant="primary" size="large" className="w-full">Subscribe Now</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
