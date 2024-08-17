import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { PaymentContainer } from '../components/Checkout';
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

    return (
        <div className="flex flex-col p-10 items-center mx-auto relative">
            <div className={`flex justify-center md:justify-between p-3 w-full ${inter.className} flex-wrap`}>
                <div className="w-full md:w-[calc(100%-400px)] flex flex-col justify-center">
                {productData && (
                <>
                    {/* Display the heading */}
                    <h1 className="text-4xl text-center font-bold mb-4">{productData.heading}</h1>

                    {/* Display the image */}
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={productData.image}
                            alt={productData.title}
                            className="w-32 h-32 object-cover"
                        />
                        <h3 className="text-2xl font-semibold mt-2">{productData.title}</h3>
                    </div>

                    {/* Display the pixel */}
                    {/* <div className="mb-8">
                        <img
                            src={productData.pixel}
                            alt="Tracking Pixel"
                            className="w-1 h-1"
                        />
                    </div> */}
                </>
            )}
                    <PaymentContainer />
                </div>

                <div className="w-full md:w-[380px] md:fixed md:right-0 top-0 md:h-full bg-white shadow-lg p-6 overflow-y-auto">
                    <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
                        <div className="flex items-center">
                            <img
                                src="https://checkitout.ai/demo19/images/pins.png" 
                                alt="Stripe Pins"
                                className="w-16 h-16 rounded"
                            />
                            <div className="ml-4">
                                <div className="flex items-center">
                                    <span className="text-sm bg-indigo-200 text-indigo-600 font-medium py-1 px-2 rounded-full">2</span>
                                    <h3 className="ml-2 text-base font-semibold text-gray-800">Stripe Pins</h3>
                                </div>
                                <p className="text-sm text-gray-500">Collector Set</p>
                            </div>
                        </div>
                        <p className="text-base font-medium text-indigo-600 md:text-right">2 x £29.99</p>
                    </div>

                    <div className="border-t mt-6 pt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-800">
                            <p>Subtotal/Unit</p>
                            <p>£29.99</p>
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-medium text-gray-800">
                            <p>Shipping</p>
                            <p className="text-indigo-600">Free</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
