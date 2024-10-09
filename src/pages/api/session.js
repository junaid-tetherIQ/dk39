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

const config = new Config({
  apiKey: 'AQE0hmfxKonLbxJKw0m/n3Q5qf3VZIpeDpJfQEBY0n25jnRCjcJlQRtDFN6svA/EQyB3A9ve4xDBXVsNvuR83LVYjEgiTGAH-lHUZ43x2tkVuSr3FLw/P9SOdgmH0d1k7nCB01LB1ni8=-i1iP>HLee^Hsr?r,j3)',
  environment: 'LIVE',
  checkoutEndpoint: 'https://checkout-live.adyen.com/v68',
});

const client = new Client({ config,liveEndpointUrlPrefix:'c8596343894f027d-LascauxEnterprises' });
const checkout = new CheckoutAPI(client);

const merchantAccount = 'Luxoria_luxoriasportsinnovate';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  try {
    const response = await checkout.sessions({
      amount: { currency: 'EUR', value: 2999 }, 
      countryCode: 'NL',
      merchantAccount,
      reference: randomUUID(),
      returnUrl: 'http://localhost.co',
      shopperReference: 'unique-shopper-id', 
      shopperInteraction: 'Ecommerce',
      allowedPaymentMethods: ['scheme'],
    });
    res.status(200).json({
      id: response.id,
      sessionData: response.sessionData ?? '',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
