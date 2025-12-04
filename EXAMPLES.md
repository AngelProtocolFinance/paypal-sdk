# PayPal SDK Examples

This file contains code examples for using the PayPal SDK.

## Table of Contents

- [Using PayPalClient (Recommended)](#using-paypalclient-recommended)
- [Orders API](#orders-api)
- [Subscriptions API](#subscriptions-api)
- [Manual Authentication (Legacy)](#manual-authentication-legacy)

## Using PayPalClient (Recommended)

The `PayPalClient` class provides a functional, modular API where you create service instances from the client using factory functions.

```typescript
import { PayPalClient, createOrdersService } from '@better-giving/paypal-sdk';

// Initialize client with your credentials
const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox', // or 'production'
});

// Create service instance using factory function
const orders = createOrdersService(client);

// The service is now configured with the client's authentication
// Check configuration
console.log('Base URL:', client.getBaseUrl());
console.log('Is Production:', client.isProduction());

// Manually refresh token if needed
await client.refreshToken();
```

## Orders API

### Create an Order

```typescript
import { PayPalClient, createOrdersService } from '@better-giving/paypal-sdk';

const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox',
});

// Create the orders service
const orders = createOrdersService(client);

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
      payPalRequestId: `order-${Date.now()}` // Optional idempotency key
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
```

### Get Order Details

```typescript
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
```

### Capture Payment for an Order

```typescript
async function captureOrder(orderId: string) {
  try {
    const response = await orders.OrdersService.ordersCapture({
      id: orderId,
      payPalRequestId: `capture-${Date.now()}`
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
```

## Subscriptions API

### Create a Subscription Plan

```typescript
import { PayPalClient, createSubscriptionsService } from '@better-giving/paypal-sdk';

const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox',
});

// Create the subscriptions service
const subscriptions = createSubscriptionsService(client);

async function createPlan() {
  try {
    const planRequest = {
      product_id: 'PRODUCT_ID_HERE', // Create a product first
      name: 'Basic Subscription Plan',
      description: 'Basic subscription with monthly billing',
      billing_cycles: [{
        frequency: {
          interval_unit: 'MONTH' as const,
          interval_count: 1
        },
        tenure_type: 'REGULAR' as const,
        sequence: 1,
        total_cycles: 12,
        pricing_scheme: {
          fixed_price: {
            value: '19.99',
            currency_code: 'USD'
          }
        }
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3
      }
    };

    const response = await subscriptions.PlansService.plansCreate({
      requestBody: planRequest,
      payPalRequestId: `plan-${Date.now()}`
    });

    console.log('Subscription plan created:');
    console.log('Plan ID:', response.id);
    console.log('Status:', response.status);

    return response;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
}
```

### Create a Subscription

```typescript
async function createSubscription(planId: string) {
  try {
    const subscriptionRequest = {
      plan_id: planId,
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
      subscriber: {
        email_address: 'customer@example.com',
        name: {
          given_name: 'John',
          surname: 'Doe'
        }
      },
      application_context: {
        brand_name: 'Your Brand',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      }
    };

    const response = await subscriptions.SubscriptionsService.subscriptionsCreate({
      requestBody: subscriptionRequest,
      payPalRequestId: `subscription-${Date.now()}`
    });

    console.log('Subscription created:');
    console.log('Subscription ID:', response.id);
    console.log('Status:', response.status);
    console.log('Approval URL:', response.links?.find(l => l.rel === 'approve')?.href);

    return response;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}
```

### Get Subscription Details

```typescript
async function getSubscription(subscriptionId: string) {
  try {
    const response = await subscriptions.SubscriptionsService.subscriptionsGet({
      subscriptionId
    });

    console.log('Subscription details:');
    console.log('ID:', response.id);
    console.log('Status:', response.status);
    console.log('Plan ID:', response.plan_id);
    console.log('Subscriber:', response.subscriber);

    return response;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}
```

## Manual Authentication (Legacy)

If you prefer to handle authentication manually without using `PayPalClient`:

```typescript
import { orders } from '@better-giving/paypal-sdk';

// Configure the API client manually
orders.OpenAPI.BASE = 'https://api-m.sandbox.paypal.com';
orders.OpenAPI.TOKEN = 'YOUR_ACCESS_TOKEN'; // You need to fetch this yourself

// Then use the services
const order = await orders.OrdersService.ordersCreate({
  requestBody: {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100.00'
      }
    }]
  }
});
```

### Getting Access Token Manually

```typescript
import axios from 'axios';

async function getAccessToken() {
  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID!,
        password: process.env.PAYPAL_CLIENT_SECRET!
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
}

// Use it
orders.OpenAPI.TOKEN = await getAccessToken();
```
