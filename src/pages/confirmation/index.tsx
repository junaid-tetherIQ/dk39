'use client';
import React, { useEffect } from 'react';

declare global {
  interface Window {
    fbPixelInitialized?: boolean;
  }
}

const Page: React.FC = () => {
  useEffect(() => {
    console.log("Running");

    if (!window.fbPixelInitialized) {
      window.fbPixelInitialized = true; // Set a flag to indicate that the pixel has been initialized

      // Check if the Meta Pixel script is already present
      if (!document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')) {
        // Create and append the Meta Pixel script
        const metaPixelScript = document.createElement('script');
        metaPixelScript.async = true;
        metaPixelScript.innerHTML = `
          !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n = f.fbq = function() {
              n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if(!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1492043641437442');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(metaPixelScript);
      }

      // Create and append the Purchase Event script
      const purchaseEventScript = document.createElement('script');
      purchaseEventScript.async = true;
      purchaseEventScript.innerHTML = `
        fbq('track', 'Purchase', {
          value: 9.99,
          currency: 'USD',
          contents: [{id: 'P12345', quantity: 1}],
          content_type: 'product'
        });
      `;
      document.head.appendChild(purchaseEventScript);
    }

    return () => {
      // Clean up only the purchase event script when the component is unmounted
      const purchaseEventScript = document.querySelector('script[fbq="Purchase"]');
      if (purchaseEventScript && purchaseEventScript.parentNode) {
        purchaseEventScript.parentNode.removeChild(purchaseEventScript);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">Félicitations !</h1>
        <p className="text-lg text-gray-700 mb-6">
          Votre paiement a été traité avec succès. Merci pour votre achat !
        </p>
        <div className="flex items-center justify-center">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Page;
