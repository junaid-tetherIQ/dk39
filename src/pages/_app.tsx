import '@/styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        // Select all elements with any class containing "adyen-checkout"
        const elementsWithClass = document.querySelectorAll('*[class*="adyen-checkout"]');
        
        elementsWithClass.forEach((element) => {
          // Get the original class names
          const originalClasses = Array.from(element.classList);

          // Create a new array for updated class names
          const newClasses = originalClasses.map((className) => {
            // Replace any instance of 'adyen-checkout' with 'offers' 
            return className.replace(/adyen-checkout/g, 'offers');
          });

          // Remove all original classes and add updated ones
          element.classList.remove(...originalClasses);
          element.classList.add(...newClasses);
        });

        // Select all elements with any ID containing "adyen-checkout"
        const elementsWithId = document.querySelectorAll('[id*="adyen-checkout"]');
        
        elementsWithId.forEach((element) => {
          // Get the original ID
          const originalId = element.id;

          // Replace 'adyen-checkout' with 'offers' in the ID
          const newId = originalId.replace(/adyen-checkout/g, 'offers');

          // Update the ID of the element
          element.id = newId;
        });
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array to run only on initial render

  return <Component {...pageProps} />;
}
