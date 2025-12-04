import { orders } from '../generated';

// Configure the API client
orders.OpenAPI.BASE = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing
orders.OpenAPI.TOKEN = 'YOUR_ACCESS_TOKEN'; // Replace with your OAuth2 access token

// Example: Create an order
async function createOrder() {
  try {
    const orderRequest = {
      intent: 'CAPTURE' as const,
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '100.00'
        },
        description: 'Test order from PayPal SDK'
      }]
    };

    const response = await orders.OrdersService.ordersCreate({
      requestBody: orderRequest,
      paypalRequestId: `order-${Date.now()}` // Optional idempotency key
    });

    console.log('Order created successfully:');
    console.log('Order ID:', response.id);
    console.log('Status:', response.status);
    console.log('Links:', response.links);

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Example: Get order details
async function getOrder(orderId: string) {
  try {
    const response = await orders.OrdersService.ordersGet({
      id: orderId
    });

    console.log('Order details:');
    console.log('ID:', response.id);
    console.log('Status:', response.status);
    console.log('Amount:', response.purchase_units?.[0]?.amount);

    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Example: Capture payment for an order
async function captureOrder(orderId: string) {
  try {
    const response = await orders.OrdersService.ordersCapture({
      id: orderId,
      paypalRequestId: `capture-${Date.now()}`
    });

    console.log('Payment captured:');
    console.log('Capture ID:', response.purchase_units?.[0]?.payments?.captures?.[0]?.id);
    console.log('Status:', response.status);

    return response;
  } catch (error) {
    console.error('Error capturing order:', error);
    throw error;
  }
}

// Run examples (uncomment to test)
// createOrder();
// getOrder('ORDER_ID_HERE');
// captureOrder('ORDER_ID_HERE');
