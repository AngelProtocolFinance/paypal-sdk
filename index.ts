// Re-export all APIs from generated directory
export * as orders from './generated/orders/index.js';
export * as payments from './generated/payments/index.js';
export * as invoicing from './generated/invoicing/index.js';
export * as subscriptions from './generated/subscriptions/index.js';
export * as vault from './generated/vault/index.js';
export * as payouts from './generated/payouts/index.js';
export * as partnerreferrals from './generated/partner-referrals/index.js';
export * as disputes from './generated/disputes/index.js';
export * as catalog from './generated/catalog/index.js';
export * as tracking from './generated/tracking/index.js';
export * as webprofiles from './generated/web-profiles/index.js';
export * as webhooks from './generated/webhooks/index.js';
export * as transactions from './generated/transactions/index.js';

// Export PayPalClient from src
export { PayPalClient, type PayPalClientConfig, type PayPalEnvironment } from './src/client.js';
