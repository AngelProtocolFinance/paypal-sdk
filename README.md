# @better-giving/paypal-sdk

A fully tree-shakeable TypeScript SDK for PayPal REST APIs, generated from the official [PayPal REST API OpenAPI Specifications](https://github.com/paypal/paypal-rest-api-specifications).

## Features

- **Tree-shakeable ESM**: Only bundle what you use
- **Full TypeScript support**: Complete type definitions
- **Modular exports**: Import individual APIs for smaller bundles
- **Auto-generated**: Always up-to-date with PayPal's official OpenAPI specs

This SDK provides TypeScript clients for all major PayPal REST APIs:

- **Orders API (v2)** - Create and manage orders
- **Payments API (v2)** - Process payments
- **Invoicing API (v2)** - Create and manage invoices
- **Subscriptions API (v1)** - Manage billing subscriptions
- **Vault API (v3)** - Store payment method tokens
- **Payouts API (v1)** - Send batch payouts
- **Partner Referrals API (v2)** - Manage partner referrals
- **Disputes API (v1)** - Handle customer disputes
- **Catalog API (v1)** - Manage product catalogs
- **Tracking API (v1)** - Add shipment tracking
- **Web Profiles API (v1)** - Manage payment experiences
- **Webhooks API (v1)** - Configure webhook notifications
- **Transactions API (v1)** - Search transaction history

## Installation

```bash
pnpm add @better-giving/paypal-sdk
# or
npm install @better-giving/paypal-sdk
# or
yarn add @better-giving/paypal-sdk
```

## Usage

### Using PayPalClient (Recommended)

The easiest way to use the SDK is with the `PayPalClient` class and factory functions for a functional, modular API:

```typescript
import { PayPalClient, createOrdersService } from '@better-giving/paypal-sdk';

// Create a client with your credentials
const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox', // or 'production'
});

// Create service instance using factory function (tree-shakeable!)
const orders = createOrdersService(client);

// Use the service - authentication is handled automatically!
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

console.log('Order ID:', order.id);
```

The `PayPalClient`:
- Provides a functional, modular API design with factory functions
- **Fully tree-shakeable** - only import the services you need (see [TREE_SHAKING.md](./TREE_SHAKING.md))
- Automatically fetches and refreshes access tokens
- Configures service instances with authentication
- Supports both sandbox and production environments
- Caches tokens until they expire

Each factory function is in its own file, ensuring that unused services are completely excluded from your bundle.

### Tree-shakeable Imports (Manual Auth)

You can also import APIs individually and configure authentication manually:

```typescript
// Import only the orders API (tree-shakeable)
import { OrdersService, OpenAPI } from '@better-giving/paypal-sdk/orders';

// Configure authentication
OpenAPI.BASE = 'https://api-m.sandbox.paypal.com';
OpenAPI.TOKEN = 'YOUR_ACCESS_TOKEN';

// Create an order
const order = await OrdersService.ordersCreate({
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

console.log('Order ID:', order.id);
```

### Import Multiple APIs

```typescript
// Import multiple APIs (each is tree-shakeable)
import { OrdersService, OpenAPI as OrdersAPI } from '@better-giving/paypal-sdk/orders';
import { SubscriptionsService, OpenAPI as SubsAPI } from '@better-giving/paypal-sdk/subscriptions';

// Configure both
OrdersAPI.BASE = SubsAPI.BASE = 'https://api-m.sandbox.paypal.com';
OrdersAPI.TOKEN = SubsAPI.TOKEN = 'YOUR_ACCESS_TOKEN';
```

### All APIs from Main Export

```typescript
// Import all APIs (only use if you need multiple APIs)
import { orders, payments, subscriptions } from '@better-giving/paypal-sdk';

// Configure
orders.OpenAPI.BASE = 'https://api-m.sandbox.paypal.com';
orders.OpenAPI.TOKEN = 'YOUR_ACCESS_TOKEN';
```

## Available Exports

Each API can be imported individually for tree-shaking:

```typescript
import * as orders from '@better-giving/paypal-sdk/orders';
import * as payments from '@better-giving/paypal-sdk/payments';
import * as invoicing from '@better-giving/paypal-sdk/invoicing';
import * as subscriptions from '@better-giving/paypal-sdk/subscriptions';
import * as vault from '@better-giving/paypal-sdk/vault';
import * as payouts from '@better-giving/paypal-sdk/payouts';
import * as partnerReferrals from '@better-giving/paypal-sdk/partner-referrals';
import * as disputes from '@better-giving/paypal-sdk/disputes';
import * as catalog from '@better-giving/paypal-sdk/catalog';
import * as tracking from '@better-giving/paypal-sdk/tracking';
import * as webProfiles from '@better-giving/paypal-sdk/web-profiles';
import * as webhooks from '@better-giving/paypal-sdk/webhooks';
import * as transactions from '@better-giving/paypal-sdk/transactions';
```

## Examples

For more detailed examples, see [EXAMPLES.md](./EXAMPLES.md).

### Create and Capture an Order

```typescript
import { PayPalClient, createOrdersService } from '@better-giving/paypal-sdk';

// Initialize client (do this once)
const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox',
});

// Create the orders service
const orders = createOrdersService(client);

// Create order
const order = await orders.OrdersService.ordersCreate({
  requestBody: {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100.00'
      },
      description: 'Product purchase'
    }]
  },
  payPalRequestId: `order-${Date.now()}`
});

// Capture payment
const captured = await orders.OrdersService.ordersCapture({
  id: order.id,
  payPalRequestId: `capture-${Date.now()}`
});

console.log('Payment captured:', captured.status);
```

### Create a Subscription

```typescript
import { PayPalClient, createSubscriptionsService } from '@better-giving/paypal-sdk';

const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox',
});

// Create the subscriptions service
const subscriptions = createSubscriptionsService(client);

const subscription = await subscriptions.SubscriptionsService.subscriptionsCreate({
  requestBody: {
    plan_id: 'PLAN_ID',
    subscriber: {
      email_address: 'customer@example.com',
      name: {
        given_name: 'John',
        surname: 'Doe'
      }
    }
  }
});

console.log('Subscription ID:', subscription.id);
```

### Send a Payout

```typescript
import { PayPalClient, createPayoutsService } from '@better-giving/paypal-sdk';

const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'production', // Use production for real payouts
});

// Create the payouts service
const payouts = createPayoutsService(client);

const payout = await payouts.PayoutsService.payoutsPost({
  requestBody: {
    sender_batch_header: {
      sender_batch_id: `batch-${Date.now()}`,
      email_subject: 'You have a payout!',
      email_message: 'You have received a payout.'
    },
    items: [{
      recipient_type: 'EMAIL',
      amount: {
        value: '10.00',
        currency: 'USD'
      },
      receiver: 'recipient@example.com',
      note: 'Thanks for your service!'
    }]
  }
});
```

## Authentication

The `PayPalClient` handles authentication automatically. You just need to provide your client ID and secret:

```typescript
import { PayPalClient } from '@better-giving/paypal-sdk';

const client = new PayPalClient({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: 'sandbox', // or 'production'
});

// The client automatically:
// - Fetches access tokens when needed
// - Caches tokens until they expire
// - Refreshes tokens automatically
// - Configures all API modules

// You can also manually refresh the token if needed
await client.refreshToken();

// Or get the current access token
const token = await client.getAccessToken();
```

## Development

```bash
# Install dependencies
pnpm install

# Generate SDK from OpenAPI specs
pnpm run generate

# Build TypeScript to ESM
pnpm run build

# Clean generated files
pnpm run clean
```

## Project Structure

```
paypal-sdk/
├── src/                    # PayPalClient source code
├── generated/              # TypeScript SDK source (generated)
├── dist/                   # Compiled ESM output
├── specs/                  # PayPal OpenAPI specifications
├── scripts/                # SDK generation script
│   └── generate-sdk.js
├── EXAMPLES.md             # Usage examples
├── package.json
├── tsconfig.json
└── README.md
```

## Publishing

```bash
# Build and publish to npm
pnpm publish
```

The package is configured with:
- `"sideEffects": false` for optimal tree-shaking
- `"type": "module"` for native ESM support
- Granular exports for each API module
- TypeScript declaration maps for better IDE support

## License

MIT

## Credits

Generated from official PayPal REST API specifications:
https://github.com/paypal/paypal-rest-api-specifications
