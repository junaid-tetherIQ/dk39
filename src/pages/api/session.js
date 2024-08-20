import Cors from 'cors';
import { randomUUID } from 'crypto';
import { CheckoutAPI, Client, Config } from '@adyen/api-library';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: 'http://localhost:30000', // Replace with your frontend URL
  credentials: true,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Adyen API configuration
const config = new Config({
  apiKey: process.env.NEXT_PUBLIC_API,
  checkoutEndpoint: 'https://checkout-live.adyen.com/v68', // Use the correct endpoint based on your environment
});

const client = new Client({
  config,
  liveEndpointUrlPrefix: process.env.NEXT_PUBLIC_PREFIX,
});

const checkout = new CheckoutAPI(client);
const merchantAccount = process.env.NEXT_PUBLIC_ACCOUNT;

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Destructure the request body to get user details including address
    const { address, shopperReference } = req.body;

    // Prepare the payment session request with the billing address included
    const response = await checkout.sessions({
      amount: { currency: 'EUR', value: 999 }, // Payment amount of 9.99 EUR
      countryCode: 'NL', // Country code
      merchantAccount,
      reference: randomUUID(), // Unique reference for this transaction
      returnUrl: 'http://localhost.co', // Replace with your actual return URL
      shopperReference, // Replace with unique ID for the customer
      recurringProcessingModel: 'Subscription', // Set up a subscription
      enableRecurring: true, // Enable recurring payments
      shopperInteraction: 'Ecommerce', // Specify the type of interaction
      allowedPaymentMethods: ['scheme'], // Allow only card payments

      // Billing address details
      billingAddress: {
        street: address.street,
        postalCode: address.postalCode,
        city: address.city,
        houseNumberOrName: address.houseNumberOrName,
        country: address.country,
      },
    });

    // Return the session ID and session data
    res.status(200).json({
      id: response.id,
      sessionData: response.sessionData ?? '',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
