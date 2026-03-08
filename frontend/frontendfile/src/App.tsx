import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNavigation from './components/MobileBottomNavigation';
import LandingPage from './pages/LandingPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SubscriptionCreationPage from './pages/SubscriptionCreationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-lightBg dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/subscribe" element={<SubscriptionCreationPage />} />
            <Route path="/subscribe/:productId" element={<SubscriptionCreationPage />} />
            <Route path="/dashboard/*" element={<UserDashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNavigation />
      </div>
    </Router>
  );
}

export default App;
