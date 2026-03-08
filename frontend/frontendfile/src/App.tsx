import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route path="/login" element={<Navigate to="/login/customer" replace />} />
            <Route path="/login/customer" element={<LoginPage forcedRole="CUSTOMER" />} />
            <Route path="/login/admin" element={<LoginPage forcedRole="STAFF" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/:role" element={<RegisterPage />} />
            <Route path="/password/reset" element={<PasswordResetRequestPage />} />
            <Route path="/password/reset/confirm" element={<PasswordResetConfirmPage />} />
            <Route
              path="/subscribe"
              element={(
                <ProtectedRoute requiredRole="CUSTOMER">
                  <SubscriptionCreationPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/subscribe/:productId"
              element={(
                <ProtectedRoute requiredRole="CUSTOMER">
                  <SubscriptionCreationPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/dashboard/*"
              element={(
                <ProtectedRoute requiredRole="CUSTOMER">
                  <UserDashboardPage />
                </ProtectedRoute>
              )}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/admin"
              element={(
                <ProtectedRoute requiredRole="STAFF">
                  <AdminDashboardPage />
                </ProtectedRoute>
              )}
            />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNavigation />
      </div>
    </Router>
  );
}

export default App;
