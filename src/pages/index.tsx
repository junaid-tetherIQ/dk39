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
}

export default function Home() {
    const router = useRouter();
    const { title, image, heading, pixel } = router.query;

    const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (title || image || heading || pixel) {
            setProductData({
                title: title as string,
                image: image as string,
                heading: heading as string,
                pixel: pixel as string,
            });
        }
    }, [title, image, heading, pixel]);

    useEffect(() => {
        // Simulating a loading delay
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false once the component is ready
        }, 1000); // Replace with the actual loading time if necessary

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col p-10 items-center mx-auto relative">
            <div className={`flex justify-center md:justify-between p-3 w-full ${inter.className} flex-wrap`}>
                <div className="w-full md:w-[calc(100%-400px)] flex flex-col justify-center">
                    {loading ? (
                        // Render a loading animation while the component is loading
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                        </div>
                    ) : (
                        <PaymentContainer />
                    )}
                </div>
                {productData && (
                    <div className="w-full md:w-[380px] md:fixed md:right-0 top-0 md:h-full bg-white shadow-lg p-6 overflow-y-auto">
                        <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
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
                                        <h3 className="ml-2 text-base font-semibold text-gray-800">{productData.title}</h3>
                                    </div>
                                </div>
                            </div>
                            <p className="text-base font-medium text-indigo-600 md:text-right">£9.99</p>
                        </div>

                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                                <p>Subtotal/Unit</p>
                                <p>£9.99</p>
                            </div>
                            <div className="flex justify-between mt-2 text-sm font-medium text-gray-800">
                                <p>Shipping</p>
                                <p className="text-indigo-600">Free</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
