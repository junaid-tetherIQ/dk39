// pages/index.tsx or a component file
import React from 'react';
import Checkout from './checkout';
const Index = () => {
  return (
    <div>
      <iframe 
        src="/checkout" // URL path to the page you created
        style={{ border: 'none', width: '100%', height: '100%' }} 
        sandbox="allow-scripts allow-forms"
      >
      </iframe>
    </div>
  );
};

export default Index;
