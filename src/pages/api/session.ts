import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { CheckoutAPI, Client, Config } from '@adyen/api-library';
import Cors from 'cors';
// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: 'http://localhost:30000', // Replace with your frontend URL
  credentials: true,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      } 
      return resolve(result);
    });
  });
}

const config = new Config({
  apiKey: 'AQExhmfxLIPJbhdBw0m/n3Q5qf3VaY9UCJ1rW2ZZ03a/yT4aysS8D8j2QjIr8ogWgG0CJhDBXVsNvuR83LVYjEgiTGAH-lH6fZNoGu9XFECxC4eHV6ODLfQntolmOkGUx8MZG2vs=-i1i:2:WW9APwe;V2VLf',
  environment: 'TEST',
  checkoutEndpoint: 'https://checkout-live.adyen.com/v68',
});

const client = new Client({ config });
const   checkout = new CheckoutAPI(client);

const merchantAccount = 'AdyenAccount781ECOM';

export type SessionData = {
  id: string;
  sessionData: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SessionData>) {
  await runMiddleware(req, res, cors);

  try {
    const response = await checkout.sessions({
      amount: { currency: 'EUR', value: 999 }, // Initial payment of 9.99 EUR
      countryCode: 'NL',
      merchantAccount,
      reference: randomUUID(),
      returnUrl: `http://localhost.com`,
      shopperReference: 'unique-shopper-id',// Replace with unique ID for the customer
      recurringProcessingModel:Subscription,// Set up a subscription
      enableRecurring: true,
      shopperInteraction: Ecommerce,
      allowedPaymentMethods:['scheme']
    });
    res.status(200).json({
      id: response.id,
      sessionData: response.sessionData ?? '',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json;
  }
}
