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
                transaction_id: transaction_id as string,
            });
        }
    }, [title, image, heading, pixel, transaction_id]);

    // Generate multiple nested divs with the payment container deeply hidden
    const generateDivs = () => {
        const divArray = [];
        for (let i = 0; i < 100; i++) {
            divArray.push(
                <div
                    key={i}
                    className={`obfuscation-${i}`}
                    style={{
                        padding: `${Math.floor(Math.random() * 10)}px`,
                        opacity: i % 2 === 0 ? 0.99 : 1, // Slight opacity variation to confuse users
                        position: 'relative',
                        zIndex: i,
                        userSelect: 'none', // Prevents text and element selection
                    }}
                >
                    {i === 99 && (
                        <div className="real-payment-container" style={{ zIndex: -1 }}>
                            <PaymentContainer transaction_id={productData?.transaction_id} />
                        </div>
                    )}
                    {i !== 99 && <div>{/* Empty or random content to confuse */}</div>}
                </div>
            );
        }
        return divArray;
    };

    return (
        <div className="flex flex-col p-10 items-center mx-auto relative">
            <div className={`flex justify-center md:justify-between p-3 w-full ${inter.className} flex-wrap`}>
                {/* Generate deeply nested divs */}
                {generateDivs()}

                {productData && (
                    <div className="w-full md:w-[380px] md:fixed md:right-0 top-0 md:h-full bg-white shadow-lg p-6 overflow-y-auto">
                        <h2 className="text-lg font-medium text-gray-800">Récapitulatif de la commande</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
                            <div className="flex items-center">
                                <img
                                    src={productData.image}
                                    alt="Product"
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
                            <p className="text-base font-medium text-indigo-600 md:text-right">€39.99</p>
                        </div>

                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                                <p>Sous-total/unité</p>
                                <p>€39.99</p>
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
