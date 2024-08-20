import type { NextApiRequest, NextApiResponse } from 'next';
import { hmacValidator } from '@adyen/api-library';
import dbConnect from '../../../lib/mongodb';
import RecurringDetail from '../../../models/RecurringDetail';

const hmacKey = '9263D3C96E0E6EC3F3948C6DE2510DEB7CC2D727462B3FAED8C1E9EFA7C1F3F5';
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

      const recurringDetailReference = notification.additionalData['recurring.recurringDetailReference'];
      const shopperReference = notification.additionalData['recurring.shopperReference'];
      const paymentMethod = notification.paymentMethod;

      // Save recurring detail regardless of eventCode
      if (recurringDetailReference && shopperReference) {
        console.log("Saving recurring detail - recurringDetailReference:" + recurringDetailReference +
          " shopperReference:" + shopperReference +
          " paymentMethod:" + paymentMethod);

        await put(recurringDetailReference, paymentMethod, shopperReference);
      }

      // Handle different eventCodes if needed
      if (notification.eventCode === "AUTHORISATION") {
        console.log("Payment authorized - pspReference:" + notification.pspReference +
          " eventCode:" + notification.eventCode);
      } else {
        console.log("Unexpected eventCode: " + notification.eventCode);
      }

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
    if (error === 11000) { // Duplicate key error code
      console.error('Duplicate key error:', error);
    } else {
      console.error('Error saving recurring detail:', error);
    }
  }
}

