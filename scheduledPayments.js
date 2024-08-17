const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid'); // Import uuid function
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');

// Configure Adyen client
const config = new Config();
config.apiKey = 'AQEshmfxKY7JbxRHw0m/n3Q5qf3VbI5bCJ9FSGxZ1TnozGfYDHsyJSQotmcLatcQwV1bDb7kfNy1WIxIIkxgBw==-rhclNCexneongy/49usGnEv/Us3/wgEYXgZxIuIEuIg=-i1iF499v2m+{axGVd8U'; // Replace with your actual Adyen API key
config.checkoutEndpoint = 'https://checkout-test.adyen.com/v67'; // Use the appropriate endpoint for your environment

const client = new Client({ config });
const checkout = new CheckoutAPI(client);

// Schedule a recurring payment every minute
cron.schedule('* * * * *', async () => {
  console.log('Running cron job for recurring payments...');
  
  const recurringDetailReference = 'LDNWKRVVJQLV7L65'; // Replace with your actual recurring detail reference
  const shopperReference = 'YOUR_SHOPPER_REFERENCE'; // Replace with your actual shopper reference
  
  try {
    const response = await checkout.payments({
      amount: { currency: "EUR", value: 1199 }, // Amount in minor units
      reference: uuidv4(), // Generate unique reference
      shopperInteraction: "ContAuth",
      recurringProcessingModel: "Subscription",
      merchantAccount: 'DevelopiosECOM', // Replace with your actual merchant account
      shopperReference: shopperReference, // Replace with your actual shopper reference
      paymentMethod: {
        storedPaymentMethodId: recurringDetailReference // Ensure this ID is correct
      }
    });

    if (response.resultCode === "Authorised") {
      console.log("Recurring payment authorized");
    } else {
      console.log("Recurring payment not authorized");
    }
  } catch (err) {
    console.error(`Error during cron job payment: ${err.message}`);
    if (err.response && err.response.data) {
      console.error(`Response data: ${JSON.stringify(err.response.data)}`);
    }
  }
});
