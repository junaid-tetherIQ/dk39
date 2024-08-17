import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

export const PaymentContainer = () => {
  return (
    <div id="payment-page">
      <div className="container">
        <Checkout />
      </div>
    </div>
  );
};

const Checkout = () => {
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
      environment: 'TEST',
      clientKey: 'test_QRJPBE7OFVD3HKC6LXOEQSLNKIJ246KE', // Replace with your actual Adyen test client key
    };

    const createCheckout = async () => {
      try {
        const checkout = await AdyenCheckout({
          ...config,
          session,
          onPaymentCompleted: (response: any) => {
            if (response.resultCode !== 'Authorised') {
              alert(`Unhandled payment result "${response.resultCode}!"`);
            } else {
              // router.push('/confirmation'); // Redirect to /confirmation page
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
  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-container">
      <div ref={paymentContainer} className="payment"></div>
    </div>
  );
};