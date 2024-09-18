import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

interface CheckoutProps {
  transaction_id?: string; // Optional prop for pixel
} 

export const PaymentContainer = ({ transaction_id }: { transaction_id?: string }) => {
  return (
    <div id="payment-page">
      <div className="container">
        <Checkout transaction_id={transaction_id} />
      </div>
    </div>
  );
};

const Checkout: React.FC<CheckoutProps> = ({ transaction_id }) => {
  const paymentContainer = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }

        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError('Failed to load session');
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!session || !paymentContainer.current) {
      return;
    }

    const config = {
      environment: 'LIVE',
      clientKey: 'live_4EX5N5AEHRAOJDUBUO2A6RG5LIV5EGBR', 
    };

    const createCheckout = async () => {
      try {
        const checkout = await AdyenCheckout({
          ...config,
          session,
          paymentMethodsConfiguration: {
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              billingAddressRequired: true, // Enable billing address collection
            },
          },
 
          onPaymentCompleted: (response: any) => {
            if (response.resultCode !== 'Authorised') {
              alert(`Unhandled payment result "${response.resultCode}!"`);
            } else {
              router.push(`/confirmation?transaction_id=${transaction_id}`);
            }
          },
          onError: (error: any) => {
            alert(`Error: ${error.message}`);
          },
        });

        if (paymentContainer.current && !ignore) {
          checkout.create('dropin').mount(paymentContainer.current);
        }
      } catch (error) {
        console.error('Error creating Adyen Checkout:', error);
      }
    };

    createCheckout();

    return () => {
      ignore = true;
    };
  }, [session, router]);

  if (error) return <div>{error}</div>;
  if (loading) return  <div className="flex justify-center items-center h-full">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
</div>;

  return (
    <div className="payment-container">
      <div ref={paymentContainer} className="payment"></div>
    </div>
  );
};
