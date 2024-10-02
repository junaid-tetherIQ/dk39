import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { PaymentContainer } from '../components/Checkout';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

interface ProductData {
    title: string;
    image: string;
    heading: string;
    pixel: string;
    transaction_id: string;
}

export default function Home() {
    const router = useRouter();
    const { title, image, heading, pixel, transaction_id } = router.query;

    const [productData, setProductData] = useState<ProductData | null>(null);

    useEffect(() => {
        if (title || image || heading || pixel || transaction_id) {
            setProductData({
                title: title as string,
                image: image as string,
                heading: heading as string,
                pixel: pixel as string,
                transaction_id: transaction_id as string
            });
        }
    }, [title, image, heading, pixel, transaction_id]);

    // Detect DevTools opening
    useEffect(() => {
        const devtoolsDetector = () => {
            // Check if DevTools is open by measuring execution time
            const start = new Date().getTime();
            debugger;
            const end = new Date().getTime();
            if (end - start > 100) {
                alert("DevTools is open!");
                window.location.reload(); // Optionally, refresh the page
            }
        };
        const interval = setInterval(devtoolsDetector, 1000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div className="flex flex-col p-10 items-center mx-auto relative">

                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                </div>

            <div className={`flex justify-center md:justify-between p-3 w-full ${inter.className} flex-wrap`}>
                <div className="w-full md:w-[calc(100%-400px)] flex flex-col justify-center">
                    <PaymentContainer transaction_id={productData?.transaction_id} />
                </div>
                {productData && (
                    <div className="w-full md:w-[380px] md:fixed md:right-0 top-0 md:h-full bg-white shadow-lg p-6 overflow-y-auto">
                        <h2 className="text-lg font-medium text-gray-800">Récapitulatif de la commande</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
                            <div className="flex items-center">
                                <img
                                    src={productData.image}
                                    alt="Stripe Pins"
                                    className="w-16 h-16 rounded"
                                />
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <span className="text-sm bg-indigo-200 text-indigo-600 font-medium py-1 px-2 rounded-full"></span>
                                        <h3 className="ml-2 text-base font-semibold text-gray-800 break-words">
                                            {productData.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <p className="text-base font-medium text-indigo-600 md:text-right">€9.99</p>
                        </div>
                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                                <p>Sous-total/unité</p>
                                <p>€9.99</p>
                            </div>
                            <div className="flex justify-between mt-2 text-sm font-medium text-gray-800">
                                <p>Expédition</p>
                                <p className="text-indigo-600">Free</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
