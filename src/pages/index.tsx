// pages/index.tsx or a component file
import React from 'react';

const Index = () => {
  return (
    <div>
      <iframe 
        src="/Checkout" // URL path to the page you created
        style={{ border: 'none', width: '100%', height: '500px' }} 
        sandbox="allow-scripts allow-forms"
      >
      </iframe>
    </div>
  );
};

export default Index;
