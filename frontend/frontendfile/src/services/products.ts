export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: number;
  pricePerLitre: number;
  image: string;
  description: string;
  availability: 'In Stock' | 'Out of Stock' | 'Limited Stock';
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface AuthSession {
  token: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  is_active: boolean;
}

export interface AdminDashboardMetrics {
  totalCustomers: number;
  activeSubscriptions: number;
  todayDeliveriesCount: number;
  todayTotalQuantity: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export interface AdminSubscription {
  id: number;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  quantity: number;
  deliveryType: string;
  startDate: string;
  status: string;
  weekdays: number[];
  createdAt: string;
}

export interface AdminDelivery {
  id: number;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  productName: string;
  quantity: number;
  deliveryDate: string;
  status: string;
}

export interface AdminTodayDeliveries {
  date: string;
  deliveryCount: number;
  totalQuantity: number;
  totalsByProduct: Record<string, string>;
  deliveries: AdminDelivery[];
}

export interface AdminAnalyticsPoint {
  date: string;
  deliveriesCount: number;
  totalQuantity: number;
  revenue: number;
  newSubscriptions: number;
  newCustomers: number;
}

export interface AdminAnalyticsSummary {
  days: number;
  startDate: string;
  endDate: string;
  totals: {
    deliveriesCount: number;
    totalQuantity: number;
    revenue: number;
    newSubscriptions: number;
    newCustomers: number;
  };
  series: AdminAnalyticsPoint[];
}

export interface AdminOrder {
  id: number;
  customerName: string;
  status: 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED';
  deliveryDate: string;
  totalAmount: number;
}

export interface AdminPayment {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED';
  transactionRef: string;
  createdAt: string;
}

export interface AdminBill {
  id: number;
  customerId: number;
  customerName: string;
  subscriptionId: number;
  productName: string;
  totalAmount: number;
  qrCodeUrl: string;
  isPaid: boolean;
  createdAt: string;
}

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price_per_unit: string | number;
  image?: string | null;
  is_available?: boolean;
}

interface ApiCustomer {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  is_active: boolean;
}

interface ApiAdminDashboardMetrics {
  total_customers: number;
  active_subscriptions: number;
  today_deliveries_count: number;
  today_total_quantity: string | number;
  today_revenue: string | number;
  monthly_revenue: string | number;
}

interface ApiAdminSubscription {
  id: number;
  customer: number;
  customer_name: string;
  product: number;
  product_name: string;
  quantity: string | number;
  delivery_type: string;
  start_date: string;
  status: string;
  weekdays_display?: number[];
  created_at: string;
}

interface ApiAdminDelivery {
  id: number;
  customer_name: string;
  customer_mobile: string;
  customer_address: string;
  product_name: string;
  quantity: string | number;
  delivery_date: string;
  status: string;
}

interface ApiAdminTodayDeliveries {
  date: string;
  delivery_count: number;
  total_quantity: string | number;
  totals_by_product: Record<string, string>;
  deliveries: ApiAdminDelivery[];
}

interface ApiAdminAnalyticsPoint {
  date: string;
  deliveries_count: number;
  total_quantity: string | number;
  revenue: string | number;
  new_subscriptions: number;
  new_customers: number;
}

interface ApiAdminAnalyticsSummary {
  days: number;
  start_date: string;
  end_date: string;
  totals: {
    deliveries_count: number;
    total_quantity: string | number;
    revenue: string | number;
    new_subscriptions: number;
    new_customers: number;
  };
  series: ApiAdminAnalyticsPoint[];
}

interface ApiAdminOrder {
  id: number;
  customer_name: string;
  status: 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'UNPAID' | 'PAID' | 'FAILED';
  delivery_date: string;
  total_amount: string | number;
}

interface ApiAdminPayment {
  id: number;
  order: number;
  amount: string | number;
  method: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED';
  transaction_ref: string;
  created_at: string;
}

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const normalizeApiImage = (imageValue?: string | null): string => {
  if (!imageValue) {
    return '/images/cow-milk.png';
  }
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://') || imageValue.startsWith('data:')) {
    return imageValue;
  }
  if (imageValue.startsWith('/')) {
    return `${API_BASE_URL}${imageValue}`;
  }
  return `${API_BASE_URL}/${imageValue}`;
};

const mapApiProductToProduct = (apiProduct: ApiProduct): Product => ({
  id: String(apiProduct.id),
  name: apiProduct.name,
  category: apiProduct.category || 'General',
  pricePerLitre: Number(apiProduct.price_per_unit),
  image: normalizeApiImage(apiProduct.image),
  description: `${apiProduct.name} fresh dairy product.`,
  availability: apiProduct.is_available ? 'In Stock' : 'Out of Stock',
  nutrition: { calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8 },
});

const getAuthHeaders = (auth: AuthSession): HeadersInit => ({
  Authorization: `Bearer ${auth.token}`,
  'Content-Type': 'application/json',
});

export const fetchPublicProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/public/products/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = (await response.json()) as ApiProduct[];
  return data.map(mapApiProductToProduct);
};

export const fetchAdminProducts = async (auth: AuthSession): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = (await response.json()) as ApiProduct[];
  return data.map(mapApiProductToProduct);
};

export const fetchCategories = async (auth: AuthSession): Promise<Category[]> => {
  const productsData = await fetchAdminProducts(auth);
  const categoryNames = Array.from(new Set(productsData.map((p) => p.category)));
  return categoryNames.map((name, index) => ({ id: index + 1, name }));
};

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: number | string;
  is_active?: boolean;
  imageFile?: File | null;
}

interface UpdateProductInput extends CreateProductInput {}

export const createProduct = async (auth: AuthSession, payload: CreateProductInput): Promise<Product> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('category', typeof payload.category === 'string' ? payload.category : 'General');
  formData.append('price_per_unit', String(payload.price));
  formData.append('unit', 'LITRE');
  formData.append('is_available', 'true');
  if (payload.imageFile) {
    formData.append('image_file', payload.imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.status}`);
  }

  const data = (await response.json()) as ApiProduct;
  return mapApiProductToProduct(data);
};

export const updateProduct = async (auth: AuthSession, productId: string, payload: UpdateProductInput): Promise<Product> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('category', typeof payload.category === 'string' ? payload.category : 'General');
  formData.append('price_per_unit', String(payload.price));
  formData.append('unit', 'LITRE');
  formData.append('is_available', 'true');
  if (payload.imageFile) {
    formData.append('image_file', payload.imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/${productId}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status}`);
  }

  const data = (await response.json()) as ApiProduct;
  return mapApiProductToProduct(data);
};

export const deleteProduct = async (auth: AuthSession, productId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/${productId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.status}`);
  }
};

export const fetchCustomers = async (auth: AuthSession): Promise<Customer[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/customers/`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.status}`);
  }

  const data = (await response.json()) as ApiCustomer[];
  return data.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.mobile,
    address: customer.address,
    password: '',
    is_active: customer.is_active,
  }));
};

export const fetchAdminDashboardMetrics = async (auth: AuthSession): Promise<AdminDashboardMetrics> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch admin metrics: ${response.status}`);
  }

  const data = (await response.json()) as ApiAdminDashboardMetrics;
  return {
    totalCustomers: data.total_customers,
    activeSubscriptions: data.active_subscriptions,
    todayDeliveriesCount: data.today_deliveries_count,
    todayTotalQuantity: Number(data.today_total_quantity),
    todayRevenue: Number(data.today_revenue),
    monthlyRevenue: Number(data.monthly_revenue),
  };
};

export const fetchAdminSubscriptions = async (auth: AuthSession): Promise<AdminSubscription[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/subscriptions/`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status}`);
  }

  const data = (await response.json()) as ApiAdminSubscription[];
  return data.map((subscription) => ({
    id: subscription.id,
    customerId: subscription.customer,
    customerName: subscription.customer_name,
    productId: subscription.product,
    productName: subscription.product_name,
    quantity: Number(subscription.quantity),
    deliveryType: subscription.delivery_type,
    startDate: subscription.start_date,
    status: subscription.status,
    weekdays: subscription.weekdays_display ?? [],
    createdAt: subscription.created_at,
  }));
};

export const fetchAdminTodayDeliveries = async (auth: AuthSession): Promise<AdminTodayDeliveries> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/deliveries/today/`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch today deliveries: ${response.status}`);
  }

  const data = (await response.json()) as ApiAdminTodayDeliveries;
  return {
    date: data.date,
    deliveryCount: data.delivery_count,
    totalQuantity: Number(data.total_quantity),
    totalsByProduct: data.totals_by_product,
    deliveries: data.deliveries.map((delivery) => ({
      id: delivery.id,
      customerName: delivery.customer_name,
      customerMobile: delivery.customer_mobile,
      customerAddress: delivery.customer_address,
      productName: delivery.product_name,
      quantity: Number(delivery.quantity),
      deliveryDate: delivery.delivery_date,
      status: delivery.status,
    })),
  };
};

export const fetchAdminAnalytics = async (auth: AuthSession, days = 60): Promise<AdminAnalyticsSummary> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/analytics/?days=${days}`, {
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch admin analytics: ${response.status}`);
  }

  const data = (await response.json()) as ApiAdminAnalyticsSummary;
  return {
    days: data.days,
    startDate: data.start_date,
    endDate: data.end_date,
    totals: {
      deliveriesCount: data.totals.deliveries_count,
      totalQuantity: Number(data.totals.total_quantity),
      revenue: Number(data.totals.revenue),
      newSubscriptions: data.totals.new_subscriptions,
      newCustomers: data.totals.new_customers,
    },
    series: data.series.map((point) => ({
      date: point.date,
      deliveriesCount: point.deliveries_count,
      totalQuantity: Number(point.total_quantity),
      revenue: Number(point.revenue),
      newSubscriptions: point.new_subscriptions,
      newCustomers: point.new_customers,
    })),
  };
};

export const fetchAdminOrders = async (auth: AuthSession): Promise<AdminOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/`, {
    headers: getAuthHeaders(auth),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }
  const data = (await response.json()) as ApiAdminOrder[];
  return data.map((order) => ({
    id: order.id,
    customerName: order.customer_name,
    status: order.status,
    paymentStatus: order.payment_status,
    deliveryDate: order.delivery_date,
    totalAmount: Number(order.total_amount),
  }));
};

export const updateAdminOrderStatus = async (
  auth: AuthSession,
  orderId: number,
  status: AdminOrder['status'],
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(auth),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update order: ${response.status}`);
  }
};

export const fetchAdminPayments = async (auth: AuthSession): Promise<AdminPayment[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/payments/`, {
    headers: getAuthHeaders(auth),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch payments: ${response.status}`);
  }
  const data = (await response.json()) as ApiAdminPayment[];
  return data.map((payment) => ({
    id: payment.id,
    orderId: payment.order,
    amount: Number(payment.amount),
    method: payment.method,
    status: payment.status,
    transactionRef: payment.transaction_ref,
    createdAt: payment.created_at,
  }));
};

export const fetchAdminBills = async (auth: AuthSession): Promise<AdminBill[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/bills/`, {
    headers: getAuthHeaders(auth),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch bills: ${response.status}`);
  }
  const data = await response.json();
  return data.map((bill: any) => ({
    id: bill.id,
    customerId: bill.customer,
    customerName: bill.customer_name,
    subscriptionId: bill.subscription,
    productName: bill.product_name,
    totalAmount: Number(bill.total_amount),
    qrCodeUrl: bill.qr_code_url,
    isPaid: bill.is_paid,
    createdAt: bill.created_at,
  }));
};

export const updateAdminBillStatus = async (
  auth: AuthSession,
  billId: number,
  isPaid: boolean,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/bills/${billId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(auth),
    body: JSON.stringify({ is_paid: isPaid }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update bill: ${response.status}`);
  }
};

export const updateAdminPayment = async (
  auth: AuthSession,
  paymentId: number,
  payload: Partial<AdminPayment>,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/payments/${paymentId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(auth),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to update payment: ${response.status}`);
  }
};

export const updateAdminPaymentStatus = async (
  auth: AuthSession,
  paymentId: number,
  status: AdminPayment['status'],
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/payments/${paymentId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(auth),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update payment: ${response.status}`);
  }
};

export const updateAdminDeliveryStatus = async (
  auth: AuthSession,
  deliveryId: number,
  status: 'SCHEDULED' | 'DELIVERED' | 'SKIPPED',
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/deliveries/${deliveryId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(auth),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update delivery: ${response.status}`);
  }
};

interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  is_active?: boolean;
}

export const createCustomer = async (_auth: AuthSession, payload: CreateCustomerInput): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/customer/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      mobile: payload.phone,
      address: payload.address,
      password: payload.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create customer: ${response.status}`);
  }

  const data = (await response.json()) as ApiCustomer;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.mobile,
    address: data.address,
    password: '',
    is_active: data.is_active,
  };
};

interface UpdateCustomerInput extends CreateCustomerInput {}

export const updateCustomer = async (auth: AuthSession, customerId: number, payload: UpdateCustomerInput): Promise<Customer> => {
  const shouldDeactivate = payload.is_active === false;
  const actionPath = shouldDeactivate ? 'deactivate' : 'activate';
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/customers/${customerId}/${actionPath}/`, {
    method: 'POST',
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to update customer: ${response.status}`);
  }

  return {
    id: customerId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    password: payload.password,
    is_active: !shouldDeactivate,
  };
};

export const deleteCustomer = async (auth: AuthSession, customerId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/customers/${customerId}/deactivate/`, {
    method: 'POST',
    headers: getAuthHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`Failed to deactivate customer: ${response.status}`);
  }
};
