import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubscriptionForm from '../components/SubscriptionForm';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../services/products';
import Button from '../components/Button';

interface BillInfo {
  id: number;
  total_amount: number;
  qr_code_url: string;
  is_paid: boolean;
}

const SubscriptionCreationPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { token, user } = useAuth();
  const [successBill, setSuccessBill] = useState<BillInfo | null>(null);

  const handleSubscriptionSubmit = async (subscriptionDetails: { product: { id: string }; quantity: number; deliveryType: string; startDate: string; endDate: string }) => {
    if (!token || !user) {
      showToast('Login required before subscription.', 'error');
      navigate('/login/customer?redirect=/subscribe');
      return;
    }

    try {
      const deliveryTypeMap: Record<string, 'DAILY' | 'ALTERNATE' | 'CUSTOM'> = {
        daily: 'DAILY',
        alternate: 'ALTERNATE',
        custom: 'CUSTOM',
      };
      const productId = Number(subscriptionDetails.product.id);
      if (!Number.isFinite(productId)) {
        showToast('Please choose a product available from backend catalog.', 'error');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/customer/subscriptions/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          quantity: subscriptionDetails.quantity,
          delivery_type: deliveryTypeMap[subscriptionDetails.deliveryType] ?? 'DAILY',
          start_date: subscriptionDetails.startDate,
          end_date: subscriptionDetails.endDate,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const detail = (errorBody?.detail as string | undefined) ?? 'Failed to create subscription';
        throw new Error(detail);
      }

      const subscriptionData = await response.json();
      
      // Fetch the bill for this subscription
      const billsResponse = await fetch(`${API_BASE_URL}/api/v1/customer/bills/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (billsResponse.ok) {
        const bills = await billsResponse.json();
        const latestBill = bills.find((b: any) => b.subscription === subscriptionData.id);
        if (latestBill) {
          setSuccessBill(latestBill);
        }
      }

      showToast('Subscription Created Successfully!', 'success');
      // Instead of navigate, we show success state with bill
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to create subscription. Try again.', 'error');
    }
  };

  if (successBill) {
    return (
      <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Your milk subscription has been created. Please complete the payment using the QR code below.</p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8 inline-block">
            <p className="text-lg font-semibold mb-2">Total Amount Payable:</p>
            <p className="text-4xl font-bold text-primary mb-4">Rs {successBill.total_amount}</p>
            <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
              <img src={successBill.qr_code_url} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Scan to pay via UPI</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')} variant="primary" className="px-8">
              Go to Dashboard
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="px-8">
              Download Bill (PDF)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-lightBg dark:bg-gray-900 text-darkText dark:text-white min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-8 text-center">Create New Subscription</h1>
      <div className="max-w-2xl mx-auto">
        <SubscriptionForm
          initialProductId={productId}
          onSubmit={handleSubscriptionSubmit}
        />
      </div>
    </div>
  );
};

export default SubscriptionCreationPage;
