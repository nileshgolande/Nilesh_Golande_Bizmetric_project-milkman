import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPublicProducts } from '../services/products';
import type { Product } from '../services/products';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

type Category = Product['category'] | 'All';

const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiProducts = await fetchPublicProducts();
        if (!mounted) {
          return;
        }
        setAllProducts(apiProducts);
      } catch {
        if (!mounted) {
          return;
        }
        setError('Unable to reach backend API. Please try again later.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const byCategory =
      selectedCategory === 'All'
        ? allProducts
        : allProducts.filter((product) => product.category === selectedCategory);

    const bySearch = normalizedSearch
      ? byCategory.filter((product) =>
          [product.name, product.category, product.description].some((value) => value.toLowerCase().includes(normalizedSearch)),
        )
      : byCategory;

    setDisplayedProducts(bySearch);
  }, [allProducts, searchTerm, selectedCategory]);

  const categories: Category[] = ['All', ...Array.from(new Set(allProducts.map((p) => p.category)))];

  const getAvailabilityBadge = (availability: Product['availability']) => {
    let colorClass = '';
    switch (availability) {
      case 'In Stock':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'Limited Stock':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Out of Stock':
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`${colorClass} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
        {availability}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <div className="max-w-xl mx-auto mb-8 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name, category, description"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const query = searchTerm.trim();
            setSearchParams(query ? { q: query } : {});
          }}
        >
          Search
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setSelectedCategory(category)}
            className="shadow-sm"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
              <LoadingSkeleton height="h-56" className="mb-4" />
              <LoadingSkeleton width="w-3/4" className="mb-2" />
              <LoadingSkeleton className="mb-4" />
              <LoadingSkeleton width="w-1/2" className="mb-4" />
              <LoadingSkeleton height="h-10" />
            </div>
          ))
        ) : displayedProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <ArchiveBoxIcon className="h-24 w-24 text-gray-400 dark:text-gray-600 mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-300">No products found in this category.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please try another category or check back later.</p>
          </div>
        ) : (
          displayedProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-primary">Rs {product.pricePerLitre} / Litre</span>
                  {getAvailabilityBadge(product.availability)}
                </div>
                <Button variant="primary" className="w-full">Subscribe Now</Button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
