import { useState } from 'react';

type CheckoutSession = {
  clientSecret: string;
  publishableKey: string;
};

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);

  const initiateCheckout = async (
    amount: number,
    customerDetails: {
      name: string;
      phone: string;
      address: string;
      postcode: string;
      deliveryNotes?: string;
    },
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
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

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        // Check if response is JSON
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        } else {
          // Handle non-JSON responses
          const errorText = await response.text();
          console.error('API returned non-JSON response:', errorText);
          throw new Error('Service error - please try again later');
        }
      }

      // Check if response is JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setCheckoutSession(data);
        return data;
      } else {
        // Handle non-JSON responses
        const responseText = await response.text();
        console.error('API returned non-JSON response:', responseText);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiateCheckout,
    isLoading,
    error,
    checkoutSession,
  };
};
