import type { NextApiRequest, NextApiResponse } from 'next';
import { hmacValidator } from '@adyen/api-library';
import dbConnect from '../../../lib/mongodb';
import RecurringDetail from '../../../models/RecurringDetail';

const hmacKey = 'AFF62CFD73387F4C8766210C4A20F6C7922E8722E6FA3C7F43D57949FF1C397C';
const validator = new hmacValidator();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

      const notificationRequest = req.body;
      const notificationRequestItems = notificationRequest.notificationItems;
      const notification = notificationRequestItems[0].NotificationRequestItem;

      if (!validator.validateHMAC(notification, hmacKey)) {
        console.log("Invalid HMAC signature: " + notification);
        res.status(401).send('Invalid HMAC signature');
        return;
      }

      console.log("-- webhook payload ------");
      console.log(notification);

      const shopperReference = notification.additionalData['recurring.shopperReference'];

      if (notification.eventCode === "RECURRING_CONTRACT" && shopperReference) {
        const recurringDetailReference = notification.additionalData['recurring.recurringDetailReference'];
        const paymentMethod = notification.paymentMethod;

        console.log("Recurring authorized - recurringDetailReference:" + recurringDetailReference +
          " shopperReference:" + shopperReference +
          " paymentMethod:" + paymentMethod);

        await put(recurringDetailReference, paymentMethod, shopperReference);
      } else if (notification.eventCode === "AUTHORISATION") {
        console.log("Payment authorized - pspReference:" + notification.pspReference +
          " eventCode:" + notification.eventCode);
      } else {
        console.log("Unexpected eventCode: " + notification.eventCode);
      }

      res.status(202).send(''); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function put(recurringDetailReference: string, paymentMethod: any, shopperReference: string) {
  try {
    await dbConnect(); // Establish a database connection

    const newRecurringDetail = new RecurringDetail({
      recurringDetailReference,
      paymentMethod,
      shopperReference,
    });

    const savedRecurringDetail = await newRecurringDetail.save();
    console.log('Recurring detail saved:', savedRecurringDetail);

  } catch (error) {
    console.error('Error saving recurring detail:', error);
  }
}
