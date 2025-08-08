'use client';

import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CheckoutForm = ({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError 
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        const errorMessage = error.message || 'An unexpected error occurred';
        setMessage(errorMessage);
        onError(errorMessage);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        setMessage('Unexpected status: ' + paymentIntent?.status);
        onError('Unexpected payment status');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Card Information</h3>
            <PaymentElement 
              id="payment-element" 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    email: 'never',
                    phone: 'auto',
                  }
                },
                wallets: {
                  applePay: 'never',
                  googlePay: 'never',
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">Secure Payment</p>
          <p className="text-xs">Your payment information is processed securely. We do not store your card details.</p>
        </div>
        
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          {isLoading ? 'Processing...' : `Pay £${(amount / 100).toFixed(2)}`}
        </button>
        
        {message && (
          <div 
            id="payment-message" 
            className="p-3 text-sm rounded-md bg-red-50 text-red-600 border border-red-100"
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

interface StripeCheckoutProps {
  amount: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    postcode: string;
    deliveryNotes?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const StripeCheckout = ({ 
  amount, 
  customerDetails, 
  items, 
  onSuccess, 
  onError 
}: StripeCheckoutProps) => {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Stripe
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError('Stripe publishable key is not configured');
      setIsLoading(false);
      return;
    }

    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
  }, []);

  // Create payment intent
  useEffect(() => {
    if (!stripePromise || !amount) return;

    const createIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            customerDetails,
            items,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const { data } = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(message);
        onError(message);
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [stripePromise, amount, customerDetails, items, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!stripePromise || !clientSecret) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">
        <p>Unable to initialize payment. Please try again.</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      }}
    >
      <CheckoutForm 
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};
