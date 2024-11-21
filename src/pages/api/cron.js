import dbConnect from '../../../lib/mongodb';
import RecurringDetail from '../../../models/RecurringDetail';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutAPI, Client, Config } from '@adyen/api-library';

// Adyen API configuration
const config = new Config({
  apiKey: 'AQE0hmfxL4nPbhNFw0m/n3Q5qf3VZIpeDpJfQEBY0n25jnRCjcJlecpLqryXYi+ZmXlAXZUqbhDBXVsNvuR83LVYjEgiTGAH-6HFhCuTsmvPYE/3r8WsfdmeuJmVDGcgL8o0RHIrQW4Q=-i1ix%s;F4}^(4N7=R7$',
  environment: 'LIVE',
  checkoutEndpoint: 'https://checkout-live.adyen.com/v68',
});

const client = new Client({ config, liveEndpointUrlPrefix: 'c8596343894f027d-LascauxEnterprises' });
const checkout = new CheckoutAPI(client);

const merchantAccount = 'LuxoriaLTD';

// Function to process the payment
const processPayment = async (recurringDetailReference, shopperReference, amount) => {
  console.log(`Running payment of ${amount / 100} EUR...`);

  try {
    const payment = await checkout.payments({
      amount: { currency: 'EUR', value: amount },
      reference: uuidv4(),
      shopperInteraction: 'ContAuth',
      recurringProcessingModel: 'Subscription',
      merchantAccount: merchantAccount,
      shopperReference: shopperReference,
      paymentMethod: {
        type: 'scheme',
        storedPaymentMethodId: recurringDetailReference,
      },
    });

    if (payment.resultCode === 'Authorised') {
      console.log(`Payment authorized for ${shopperReference}`);
    } else {
      console.log(`Payment not authorized for ${shopperReference}`);
    }
  } catch (err) {
    console.error(`Error during payment: ${err.message}`);
  }
};

// API Route handler
export default async function handler(req, res) {
  try {
    await dbConnect();

    const recurringDetails = await RecurringDetail.find({});

    if (!recurringDetails.length) {
      console.log('No data to process.');
      return res.status(200).json({ message: 'No data to process.' });
    }

    const now = new Date();

    for (const detail of recurringDetails) {
      const { recurringDetailReference, shopperReference, createdAt } = detail;
      const createdDate = new Date(createdAt);

      // Calculate the difference in days between now and the card's creation date
      const timeDifference = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

      let amount = 0;

      if (timeDifference === 3) {
        // After 3 days: one-time 24.99 EUR payment
        amount = 2499;
      } else if (timeDifference >= 14 && (timeDifference - 14) % 14 === 0) {
        // Every 14 days after the initial 14 days: 39.99 EUR payment
        amount = 2499;
      }

      // If amount is set, process the payment
      if (amount > 0) {
        await processPayment(recurringDetailReference, shopperReference, amount);
      }
    }

    res.status(200).json({ message: 'Payments processed successfully.', recurringDetails });
  } catch (err) {
    console.error(`Error during payment scheduling: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}
