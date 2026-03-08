import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import {
  createProduct,
  deleteProduct,
  fetchAdminAnalytics,
  fetchAdminDashboardMetrics,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminBills,
  fetchAdminProducts,
  fetchAdminSubscriptions,
  fetchAdminTodayDeliveries,
  fetchCustomers,
  updateAdminDeliveryStatus,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminBillStatus,
  updateAdminPayment,
  updateCustomer,
  updateProduct,
} from '../services/products';
import type {
  AdminAnalyticsSummary,
  AdminDashboardMetrics,
  AdminDelivery,
  AdminOrder,
  AdminPayment,
  AdminBill,
  AdminSubscription,
  Customer,
  Product,
} from '../services/products';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  category: string;
}

const defaultProductForm: ProductFormState = {
  name: '',
  description: '',
  price: '',
  category: '',
};

const formatCurrency = (value: number): string => `Rs ${value.toFixed(2)}`;

const formatDeliveryType = (deliveryType: string): string => {
  switch (deliveryType) {
    case 'DAILY':
      return 'Daily';
    case 'ALTERNATE':
      return 'Alternate Days';
    case 'CUSTOM':
      return 'Custom Days';
    default:
      return deliveryType;
  }
};

const formatSubscriptionStatus = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'PAUSED':
      return 'Paused';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

const formatWeekdayList = (weekdays: number[]): string => {
  if (!weekdays.length) {
    return 'NA';
  }
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays.map((day) => labels[day] ?? String(day)).join(', ');
};

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<AdminSubscription[]>([]);
  const [todayDeliveries, setTodayDeliveries] = React.useState<AdminDelivery[]>([]);
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [payments, setPayments] = React.useState<AdminPayment[]>([]);
  const [editingPaymentId, setEditingPaymentId] = React.useState<number | null>(null);
  const [paymentEditForm, setPaymentEditForm] = React.useState({ amount: '', method: '' });
  const [bills, setBills] = React.useState<AdminBill[]>([]);
  const [metrics, setMetrics] = React.useState<AdminDashboardMetrics | null>(null);
  const [analytics, setAnalytics] = React.useState<AdminAnalyticsSummary | null>(null);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const [productForm, setProductForm] = React.useState<ProductFormState>(defaultProductForm);
  const [productImageFile, setProductImageFile] = React.useState<File | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [editingProductForm, setEditingProductForm] = React.useState<ProductFormState>(defaultProductForm);
  const [editingProductImageFile, setEditingProductImageFile] = React.useState<File | null>(null);
  const [subscriberFilter, setSubscriberFilter] = React.useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'CANCELLED'>('ALL');
  const [subscriberSearch, setSubscriberSearch] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');

  const categoryOptions = React.useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort(),
    [products],
  );

  const customerMap = React.useMemo(() => {
    const map = new Map<number, Customer>();
    customers.forEach((customer) => map.set(customer.id, customer));
    return map;
  }, [customers]);

  const filteredProducts = React.useMemo(() => {
    const search = productSearch.trim().toLowerCase();
    if (!search) {
      return products;
    }
    return products.filter((product) =>
      [product.name, product.category, product.description].some((value) => value.toLowerCase().includes(search)),
    );
  }, [productSearch, products]);

  const filteredSubscriptions = React.useMemo(() => {
    const search = subscriberSearch.trim().toLowerCase();
    return subscriptions.filter((subscription) => {
      const matchesStatus = subscriberFilter === 'ALL' || subscription.status === subscriberFilter;
      if (!matchesStatus) {
        return false;
      }
      if (!search) {
        return true;
      }
      const customer = customerMap.get(subscription.customerId);
      const searchFields = [
        subscription.customerName,
        subscription.productName,
        customer?.email ?? '',
        customer?.phone ?? '',
        customer?.address ?? '',
      ];
      return searchFields.some((value) => value.toLowerCase().includes(search));
    });
  }, [subscriptions, subscriberFilter, subscriberSearch, customerMap]);

  const loadAdminData = React.useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    try {
      const auth = { token };
      const [
        metricData,
        productData,
        customerData,
        subscriptionData,
        deliveryData,
        ordersData,
        paymentsData,
        billsData,
      ] = await Promise.all([
        fetchAdminDashboardMetrics(auth),
        fetchAdminProducts(auth),
        fetchCustomers(auth),
        fetchAdminSubscriptions(auth),
        fetchAdminTodayDeliveries(auth),
        fetchAdminOrders(auth),
        fetchAdminPayments(auth),
        fetchAdminBills(auth),
      ]);
      setMetrics(metricData);
      setProducts(productData);
      setCustomers(customerData);
      setSubscriptions(subscriptionData);
      setTodayDeliveries(deliveryData.deliveries);
      setOrders(ordersData);
      setPayments(paymentsData);
      setBills(billsData);
    } catch {
      showToast('Failed to load admin dashboard data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, showToast]);

  React.useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const handleCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    const parsedPrice = Number(productForm.price);
    if (!productForm.name.trim() || !productForm.category.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('Enter valid product name, category, and price.', 'error');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const createdProduct = await createProduct({ token }, {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parsedPrice,
        category: productForm.category.trim(),
        imageFile: productImageFile,
      });
      setProducts((current) => [createdProduct, ...current]);
      setProductForm(defaultProductForm);
      setProductImageFile(null);
      showToast('Product added successfully.', 'success');
    } catch {
      showToast('Failed to add product.', 'error');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProductForm({
      name: product.name,
      description: product.description,
      price: String(product.pricePerLitre),
      category: product.category,
    });
    setEditingProductImageFile(null);
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setEditingProductForm(defaultProductForm);
    setEditingProductImageFile(null);
  };

  const handleSaveProduct = async () => {
    if (!token || !editingProductId) {
      return;
    }

    const parsedPrice = Number(editingProductForm.price);
    if (!editingProductForm.name.trim() || !editingProductForm.category.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('Enter valid product edit details.', 'error');
      return;
    }

    try {
      const updatedProduct = await updateProduct({ token }, editingProductId, {
        name: editingProductForm.name.trim(),
        description: editingProductForm.description.trim(),
        price: parsedPrice,
        category: editingProductForm.category.trim(),
        imageFile: editingProductImageFile,
      });

      setProducts((current) => current.map((product) => (product.id === editingProductId ? updatedProduct : product)));
      cancelEditProduct();
      showToast('Product updated successfully.', 'success');
    } catch {
      showToast('Failed to update product.', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) {
      return;
    }
    const confirmed = window.confirm('Delete this product?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct({ token }, productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      showToast('Product deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  const handleToggleCustomerStatus = async (customer: Customer) => {
    if (!token) {
      return;
    }
    try {
      await updateCustomer({ token }, customer.id, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        password: '',
        is_active: !customer.is_active,
      });
      setCustomers((current) =>
        current.map((item) => (item.id === customer.id ? { ...item, is_active: !item.is_active } : item)),
      );
      showToast(`Customer ${customer.is_active ? 'deactivated' : 'activated'} successfully.`, 'success');
    } catch {
      showToast('Failed to update customer status.', 'error');
    }
  };

  const handleDeliveryStatusChange = async (deliveryId: number, status: 'SCHEDULED' | 'DELIVERED' | 'SKIPPED') => {
    if (!token) {
      return;
    }
    try {
      await updateAdminDeliveryStatus({ token }, deliveryId, status);
      setTodayDeliveries((current) => current.map((delivery) => (delivery.id === deliveryId ? { ...delivery, status } : delivery)));
      showToast('Delivery status updated.', 'success');
    } catch {
      showToast('Failed to update delivery status.', 'error');
    }
  };

  const handleOrderStatusChange = async (orderId: number, status: AdminOrder['status']) => {
    if (!token) {
      return;
    }
    try {
      await updateAdminOrderStatus({ token }, orderId, status);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
      showToast('Order status updated.', 'success');
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handlePaymentStatusChange = async (paymentId: number, status: AdminPayment['status']) => {
    if (!token) {
      return;
    }
    try {
      await updateAdminPaymentStatus({ token }, paymentId, status);
      setPayments((current) => current.map((payment) => (payment.id === paymentId ? { ...payment, status } : payment)));
      showToast('Payment status updated.', 'success');
    } catch {
      showToast('Failed to update payment status.', 'error');
    }
  };

  const handleEditPayment = (payment: AdminPayment) => {
    setEditingPaymentId(payment.id);
    setPaymentEditForm({ amount: String(payment.amount), method: payment.method });
  };

  const handleUpdatePayment = async () => {
    if (!token || !editingPaymentId) {
      return;
    }
    const amount = Number(paymentEditForm.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      showToast('Enter a valid amount.', 'error');
      return;
    }
    try {
      await updateAdminPayment({ token }, editingPaymentId, {
        amount,
        method: paymentEditForm.method,
      });
      setPayments((current) =>
        current.map((payment) =>
          payment.id === editingPaymentId ? { ...payment, amount, method: paymentEditForm.method } : payment,
        ),
      );
      setEditingPaymentId(null);
      showToast('Payment updated successfully.', 'success');
    } catch {
      showToast('Failed to update payment.', 'error');
    }
  };

  const handleBillStatusChange = async (billId: number, isPaid: boolean) => {
    if (!token) {
      return;
    }
    try {
      await updateAdminBillStatus({ token }, billId, isPaid);
      setBills((current) => current.map((bill) => (bill.id === billId ? { ...bill, isPaid } : bill)));
      showToast('Bill status updated.', 'success');
    } catch {
      showToast('Failed to update bill status.', 'error');
    }
  };

  const handleToggleAnalytics = async () => {
    const nextValue = !showAnalytics;
    setShowAnalytics(nextValue);

    if (!nextValue || !token) {
      return;
    }

    setAnalyticsLoading(true);
    try {
      const data = await fetchAdminAnalytics({ token }, 60);
      setAnalytics(data);
    } catch {
      showToast('Failed to load 60-day analytics.', 'error');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSearchOnProductPage = () => {
    const query = productSearch.trim();
    const searchPath = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
    navigate(searchPath);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Milkman Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage subscribers, deliveries, and product catalog.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => void loadAdminData()}>
            Refresh Data
          </Button>
          <Button type="button" variant="primary" onClick={() => void handleToggleAnalytics()}>
            {showAnalytics ? 'Hide 60-Day Analytics' : 'Show 60-Day Analytics'}
          </Button>
        </div>
      </div>

      {showAnalytics ? (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Last 60 Days Analytics</h2>
          {analyticsLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
          ) : analytics ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Range: {analytics.startDate} to {analytics.endDate}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Deliveries</p>
                  <p className="text-xl font-semibold">{analytics.totals.deliveriesCount}</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Quantity</p>
                  <p className="text-xl font-semibold">{analytics.totals.totalQuantity.toFixed(2)} L</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                  <p className="text-xl font-semibold">{formatCurrency(analytics.totals.revenue)}</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">New Subscriptions</p>
                  <p className="text-xl font-semibold">{analytics.totals.newSubscriptions}</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">New Customers</p>
                  <p className="text-xl font-semibold">{analytics.totals.newCustomers}</p>
                </div>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Deliveries</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Quantity (L)</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">New Subs</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">New Customers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {analytics.series.map((row) => (
                      <tr key={row.date}>
                        <td className="px-4 py-2">{row.date}</td>
                        <td className="px-4 py-2">{row.deliveriesCount}</td>
                        <td className="px-4 py-2">{row.totalQuantity.toFixed(2)}</td>
                        <td className="px-4 py-2">{formatCurrency(row.revenue)}</td>
                        <td className="px-4 py-2">{row.newSubscriptions}</td>
                        <td className="px-4 py-2">{row.newCustomers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No analytics data available.</p>
          )}
        </section>
      ) : null}

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Subscription Bills</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and verify payments for newly created subscriptions.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No subscription bills found.</td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{bill.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{bill.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">Rs {bill.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bill.isPaid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant={bill.isPaid ? 'secondary' : 'primary'}
                          onClick={() => handleBillStatusChange(bill.id, !bill.isPaid)}
                          className="text-xs"
                        >
                          Mark as {bill.isPaid ? 'Unpaid' : 'Paid'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(bill.qrCodeUrl, '_blank')}
                          className="text-xs"
                        >
                          View QR
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
          <p className="text-3xl font-bold mt-2">{metrics?.totalCustomers ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscriptions</p>
          <p className="text-3xl font-bold mt-2">{metrics?.activeSubscriptions ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's Deliveries</p>
          <p className="text-3xl font-bold mt-2">{metrics?.todayDeliveriesCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's Quantity</p>
          <p className="text-3xl font-bold mt-2">{(metrics?.todayTotalQuantity ?? 0).toFixed(2)} L</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's Revenue</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(metrics?.todayRevenue ?? 0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(metrics?.monthlyRevenue ?? 0)}</p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Today's Delivery Sheet</h2>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading deliveries...</p>
        ) : todayDeliveries.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No deliveries scheduled for today.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Mobile</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Address</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {todayDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="px-4 py-3">{delivery.customerName}</td>
                  <td className="px-4 py-3">{delivery.customerMobile || '-'}</td>
                  <td className="px-4 py-3">{delivery.customerAddress || '-'}</td>
                  <td className="px-4 py-3">{delivery.productName}</td>
                  <td className="px-4 py-3">{delivery.quantity} L</td>
                  <td className="px-4 py-3">{delivery.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="small" variant="secondary" onClick={() => void handleDeliveryStatusChange(delivery.id, 'SCHEDULED')}>
                        Scheduled
                      </Button>
                      <Button type="button" size="small" variant="primary" onClick={() => void handleDeliveryStatusChange(delivery.id, 'DELIVERED')}>
                        Delivered
                      </Button>
                      <Button type="button" size="small" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => void handleDeliveryStatusChange(delivery.id, 'SKIPPED')}>
                        Skipped
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No orders available.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Delivery Date</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">#{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.deliveryDate}</td>
                  <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="small" variant="secondary" onClick={() => void handleOrderStatusChange(order.id, 'PENDING')}>Pending</Button>
                      <Button type="button" size="small" variant="secondary" onClick={() => void handleOrderStatusChange(order.id, 'OUT_FOR_DELIVERY')}>Out</Button>
                      <Button type="button" size="small" variant="primary" onClick={() => void handleOrderStatusChange(order.id, 'DELIVERED')}>Delivered</Button>
                      <Button type="button" size="small" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => void handleOrderStatusChange(order.id, 'CANCELLED')}>Cancel</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
        {payments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No payments available.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3">#{payment.id}</td>
                  <td className="px-4 py-3">#{payment.orderId}</td>
                  <td className="px-4 py-3">
                    {editingPaymentId === payment.id ? (
                      <input
                        type="number"
                        value={paymentEditForm.amount}
                        onChange={(e) => setPaymentEditForm({ ...paymentEditForm, amount: e.target.value })}
                        className="w-24 p-1 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        min="0.01"
                        step="0.01"
                      />
                    ) : (
                      formatCurrency(payment.amount)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingPaymentId === payment.id ? (
                      <select
                        value={paymentEditForm.method}
                        onChange={(e) => setPaymentEditForm({ ...paymentEditForm, method: e.target.value })}
                        className="p-1 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                        <option value="OTHER">Other</option>
                      </select>
                    ) : (
                      payment.method
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : payment.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editingPaymentId === payment.id ? (
                      <div className="flex gap-2">
                        <Button type="button" size="small" variant="primary" onClick={handleUpdatePayment}>Save</Button>
                        <Button type="button" size="small" variant="secondary" onClick={() => setEditingPaymentId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="small" variant="secondary" onClick={() => handleEditPayment(payment)}>Edit</Button>
                        <Button type="button" size="small" variant="secondary" onClick={() => void handlePaymentStatusChange(payment.id, 'INITIATED')}>Initiated</Button>
                        <Button type="button" size="small" variant="primary" onClick={() => void handlePaymentStatusChange(payment.id, 'SUCCESS')}>Success</Button>
                        <Button type="button" size="small" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => void handlePaymentStatusChange(payment.id, 'FAILED')}>Failed</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Subscribers</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search by name, product, email..."
              value={subscriberSearch}
              onChange={(event) => setSubscriberSearch(event.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={subscriberFilter}
              onChange={(event) => setSubscriberFilter(event.target.value as 'ALL' | 'ACTIVE' | 'PAUSED' | 'CANCELLED')}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Subscriber</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Product Plan</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Schedule</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Customer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubscriptions.map((subscription) => {
                const customer = customerMap.get(subscription.customerId);
                return (
                  <tr key={subscription.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{subscription.customerName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Start: {subscription.startDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{customer?.email ?? '-'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{customer?.phone ?? '-'} | {customer?.address ?? '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{subscription.productName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{subscription.quantity} L | {formatSubscriptionStatus(subscription.status)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{formatDeliveryType(subscription.deliveryType)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Days: {formatWeekdayList(subscription.weekdays)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {customer ? (
                        <Button
                          type="button"
                          variant={customer.is_active ? 'outline' : 'primary'}
                          className={customer.is_active ? 'text-red-600 border-red-600 hover:bg-red-600 hover:text-white' : ''}
                          onClick={() => void handleToggleCustomerStatus(customer)}
                        >
                          {customer.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500">Unknown</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filteredSubscriptions.length ? (
          <p className="text-sm text-gray-500 mt-4">No subscriber records found for this filter.</p>
        ) : null}
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Product name"
            value={productForm.name}
            onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={productForm.category}
            onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            list="product-categories"
            required
          />
          <input
            type="number"
            placeholder="Price per litre"
            value={productForm.price}
            onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            min="1"
            step="0.01"
            required
          />
          <textarea
            placeholder="Description"
            value={productForm.description}
            onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white md:col-span-2"
            rows={3}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setProductImageFile(event.target.files?.[0] ?? null)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">{productImageFile ? productImageFile.name : 'No file selected'}</p>
          </div>
          <Button type="submit" variant="primary" disabled={isCreatingProduct} className="md:w-fit">
            {isCreatingProduct ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
        <datalist id="product-categories">
          {categoryOptions.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              className="w-full md:w-72 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <Button type="button" variant="secondary" onClick={handleSearchOnProductPage}>
              Search
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {editingProductId === product.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingProductForm.name}
                    onChange={(event) => setEditingProductForm((current) => ({ ...current, name: event.target.value }))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={editingProductForm.category}
                    onChange={(event) => setEditingProductForm((current) => ({ ...current, category: event.target.value }))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                    list="product-categories"
                  />
                  <input
                    type="number"
                    value={editingProductForm.price}
                    onChange={(event) => setEditingProductForm((current) => ({ ...current, price: event.target.value }))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                    min="1"
                    step="0.01"
                  />
                  <textarea
                    value={editingProductForm.description}
                    onChange={(event) => setEditingProductForm((current) => ({ ...current, description: event.target.value }))}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white md:col-span-2"
                    rows={2}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Replace Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setEditingProductImageFile(event.target.files?.[0] ?? null)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingProductImageFile ? editingProductImageFile.name : 'Keep current image'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="primary" onClick={() => void handleSaveProduct()}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEditProduct}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex gap-4 items-start">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{product.category} | {formatCurrency(product.pricePerLitre)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => startEditProduct(product)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => void handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!filteredProducts.length ? (
          <p className="text-sm text-gray-500 mt-4">No products found for this search.</p>
        ) : null}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
