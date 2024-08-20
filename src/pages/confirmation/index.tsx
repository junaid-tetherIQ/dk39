'use client'
import React from 'react'
import { useEffect } from 'react';
const page = () => {
  useEffect(() => {
    // Create the script for Meta Pixel Code
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
    // Create the script for Purchase Event Code
    const purchaseEventScript = document.createElement('script');
    purchaseEventScript.async = true;
    purchaseEventScript.innerHTML = `
      fbq('track', 'Purchase', {
        value: 29.99, // Replace with the actual purchase value
        currency: 'USD', // Replace with the appropriate currency code
        contents: [{id: 'P12345', quantity: 1}], // Replace with the actual product ID and quantity
        content_type: 'product'
      });
    `;
    document.head.appendChild(purchaseEventScript);
    // Clean up the scripts when the component is unmounted
    return () => {
      document.head.removeChild(metaPixelScript);
      document.head.removeChild(purchaseEventScript);
    };
  }, [])
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 `}>
      <div className='bg-white shadow-md rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-3xl font-extrabold text-green-600 mb-4'>Félicitations !</h1>
        <p className='text-lg text-gray-700 mb-6'>
          Votre paiement a été traité avec succès. Merci pour votre achat !
        </p>
        <div className='flex items-center justify-center'>
          <svg className='w-16 h-16 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
      </div>
    </div>
  );
}



export default page