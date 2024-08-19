// pages/api/schedulePayments.js

import dbConnect from '../../../lib/mongodb';
import RecurringDetail from '../../../models/RecurringDetail';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutAPI, Client, Config } from '@adyen/api-library';

// Adyen API configuration
const config = new Config({
  apiKey: process.env.ADYEN_API_KEY, // Use environment variable for security
  environment: 'TEST',
  checkoutEndpoint: 'https://checkout-live.adyen.com/v68',
});

const client = new Client({ config });
const checkout = new CheckoutAPI(client);

const merchantAccount = 'LuxoriaLTD';

// Function to process the payment
const processPayment = async (recurringDetailReference, shopperReference, amount) => {
  console.log(`Running payment of ${amount / 100} EUR...`);

  try {
    const payment = await checkout.PaymentsApi.payments({
      amount: { currency: 'EUR', value: amount },
      reference: uuidv4(),
      shopperInteraction: 'ContAuth',
      recurringProcessingModel: 'Subscription',
      merchantAccount: merchantAccount,
      shopperReference: shopperReference,
      paymentMethod: {
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

    let amount = 100; // Start with 1 EUR
    let iteration = 0;

    for (const detail of recurringDetails) {
      const { recurringDetailReference, shopperReference } = detail;

      // Charge increasing amounts every minute
      await processPayment(recurringDetailReference, shopperReference, amount);

      iteration++;
      amount = iteration === 1 ? 100 : 200; // 1 EUR on the first minute, 2 EUR after
    }

    res.status(200).json({ message: 'Payments processed successfully.' });
  } catch (err) {
    console.error(`Error during payment scheduling: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}
