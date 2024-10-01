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
    const { title, image, heading, pixel,transaction_id } = router.query;

    const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        if (title || image || heading || pixel || transaction_id) {
            setProductData({
                title: title as string,
                image: image as string,
                heading: heading as string,
                pixel: pixel as string,
                transaction_id:transaction_id as string,
            });
            setLoading(false); 
        }
    }, [title, image, heading, pixel,transaction_id]);
    useEffect(() => {
        const disableRightClick = (e: MouseEvent) => {
            e.preventDefault();
        };
        
        const disableF12 = (e: KeyboardEvent) => {
            if (e.key === 'F12') {
                e.preventDefault();
            }
        };
    
        window.addEventListener('contextmenu', disableRightClick);
        window.addEventListener('keydown', disableF12);
    
        return () => {
            window.removeEventListener('contextmenu', disableRightClick);
            window.removeEventListener('keydown', disableF12);
        };
    }, []);
    return (
        <div className="flex flex-col p-10 items-center mx-auto relative"
        style={loading ? { pointerEvents: 'none' } : {}} 
        >
            
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: loading ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)', 
                    zIndex: 1000,
                    pointerEvents: loading ? 'all' : 'none', 
                }}
            />
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
                        <p className="text-base font-medium text-indigo-600 md:text-right">€39.99</p>
                    </div>

                    <div className="border-t mt-6 pt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-800">
                            <p>Sous-total/unité</p>
                            <p>€39.99</p>
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-medium text-gray-800">
                            <p>Expédition</p>
                            <p className="text-indigo-600">Gratuite</p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}