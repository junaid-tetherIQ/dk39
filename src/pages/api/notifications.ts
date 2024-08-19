import type { NextApiRequest, NextApiResponse } from 'next';
import { hmacValidator } from '@adyen/api-library';
import dbConnect from '../../../lib/mongodb';
import RecurringDetail from '../../../models/RecurringDetail';

const hmacKey = '9075A31A31A62100581C26F862B61EE45926FBB805C8FBFF131E0368AE994FF1';
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


        const recurringDetailReference = notification.additionalData['recurring.recurringDetailReference'];
        const paymentMethod = notification.paymentMethod;

        console.log("Recurring authorized - recurringDetailReference:" + recurringDetailReference +
          " shopperReference:" + shopperReference +
          " paymentMethod:" + paymentMethod);

        await put(recurringDetailReference, paymentMethod, shopperReference);
        console.log("Payment authorized - pspReference:" + notification.pspReference +
          " eventCode:" + notification.eventCode);

        console.log("Unexpected eventCode: " + notification.eventCode);

      res.status(202).send(''); // Send a 202 response with an empty body
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

    const existingDetail = await RecurringDetail.findOne({ recurringDetailReference });

    if (existingDetail) {
      console.log('Recurring detail already exists:', existingDetail);
      return; // Optionally, handle the case where the detail already exists
    }

    const newRecurringDetail = new RecurringDetail({
      recurringDetailReference,
      paymentMethod,
      shopperReference,
    });

    const savedRecurringDetail = await newRecurringDetail.save();
    console.log('Recurring detail saved:', savedRecurringDetail);

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
      console.error('Duplicate key error:', error);
    } else {
      console.error('Error saving recurring detail:', error);
    }
  }
}

