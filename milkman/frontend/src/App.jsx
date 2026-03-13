import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = ''; // Relative to the domain

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState({
    name: localStorage.getItem('customerName'),
    token: localStorage.getItem('customerToken')
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/product/public/`);
      setProducts(response.data);
      
      const cats = {};
      response.data.forEach(p => {
        const cid = p.category;
        const cname = p.category_name || 'Category ' + cid;
        cats[cid] = cname;
      });
      setCategories(cats);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
      console.error('Error loading products:', err);
    }
  };

  const buyNow = async (productId) => {
    if (!user.token) {
      alert('Please login first');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/customer/order/`, 
        { product_id: productId, quantity: 1 },
        { headers: { 'Authorization': `Token ${user.token}` } }
      );
      alert(`Order placed. Order #${res.data.order_id}, Total ₹${res.data.total_price}`);
    } catch (e) {
      alert('Failed to place order');
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerName');
    setUser({ name: null, token: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 font-sans">
      {/* Navbar */}
      <nav className="bg-white/95 sticky top-0 z-50 shadow-md px-4 py-3 flex justify-between items-center">
        <div className="text-indigo-600 font-bold text-2xl flex items-center gap-2">
          <i className="fas fa-glass-water"></i> Milkman
        </div>
        <div className="flex gap-6 items-center">
          <a href="#products" className="text-gray-700 hover:text-indigo-600 font-medium">Products</a>
          <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
          {user.token ? (
            <div className="flex items-center gap-4">
              <span className="text-indigo-600 font-semibold">Hello, {user.name}</span>
              <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button className="text-indigo-600 font-medium">Login</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Register</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="text-center py-20 text-white px-4">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Fresh Milk Products</h1>
        <p className="text-xl opacity-90">Discover the finest quality milk and dairy products delivered to your doorstep</p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex justify-end mb-8">
          <select 
            className="p-2 rounded-lg border-none shadow-sm focus:ring-2 focus:ring-indigo-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(categories).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center text-white py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-6 rounded-xl text-center shadow-lg">
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm mt-2 opacity-80">Make sure the Django backend is running.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-white py-20 opacity-80">
            <i className="fas fa-inbox text-6xl mb-4"></i>
            <h3 className="text-2xl font-semibold">No Products Available</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products
              .filter(p => selectedCategory === 'all' || String(p.category) === selectedCategory)
              .map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col">
                  <div className="h-48 overflow-hidden bg-indigo-100 flex items-center justify-center">
                    <img 
                      src={product.image_url || `https://picsum.photos/seed/${product.name}/600/400`} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 w-max">
                      {product.category_name || 'Dairy'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description || 'Premium quality milk product'}</p>
                    <div className="mt-auto">
                      <div className="flex flex-col mb-4">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Price</span>
                        <span className="text-3xl font-black text-indigo-600">₹{parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <div className="grid gap-2">
                        <button 
                          onClick={() => buyNow(product.id)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg active:scale-95"
                        >
                          Buy Once
                        </button>
                        <button className="w-full border-2 border-indigo-100 text-indigo-600 font-bold py-2 rounded-xl hover:bg-indigo-50 transition">
                          Subscription Options
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <footer className="bg-black/10 text-white text-center py-10">
        <p>© 2024 Milkman. All rights reserved. | Fresh Milk Delivered Daily</p>
      </footer>
    </div>
  );
}

export default App;
