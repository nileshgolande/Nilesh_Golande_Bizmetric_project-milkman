import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubscriptionForm from '../components/SubscriptionForm';
import { useToast } from '../hooks/useToast';

const SubscriptionCreationPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubscriptionSubmit = (subscriptionDetails: any) => {
    console.log('Subscription Details:', subscriptionDetails);
    showToast('Subscription Created Successfully!', 'success');
    navigate('/dashboard'); // Redirect to user dashboard after subscription
  };

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
