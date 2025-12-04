# Tree-Shaking Verification

This document demonstrates how the SDK is tree-shakeable.

## Package Configuration for Tree-Shaking

### 1. Package Type
```json
"type": "module"
```
Declares this as an ESM package.

### 2. Side Effects Flag
```json
"sideEffects": false
```
Tells bundlers that no files have side effects, enabling aggressive tree-shaking.

### 3. Granular Exports
```json
"exports": {
  ".": { ... },
  "./orders": { ... },
  "./payments": { ... },
  ...
}
```
Each API is exported separately, allowing imports like:
- `import { OrdersService } from '@better-giving/paypal-sdk/orders'` (tree-shakeable)
- `import { orders } from '@better-giving/paypal-sdk'` (full package)

### 4. ES Module Output
The TypeScript compiler outputs pure ESM:
```javascript
export * as orders from './orders/index.js';
export { OrdersService } from './services/OrdersService';
```

## Tree-Shaking Examples

### Example 1: Import Only Orders API
```typescript
import { OrdersService, OpenAPI } from '@better-giving/paypal-sdk/orders';
```
**Result**: Bundler only includes:
- orders/services/OrdersService
- orders/models/* (only models used by OrdersService)
- orders/core/* (OpenAPI, request utilities)
- Approximately 50-100KB instead of full 11MB

### Example 2: Import Orders and Subscriptions
```typescript
import { OrdersService } from '@better-giving/paypal-sdk/orders';
import { SubscriptionsService } from '@better-giving/paypal-sdk/subscriptions';
```
**Result**: Bundler only includes:
- orders module
- subscriptions module
- No other 11 APIs included

### Example 3: Import Entire Package (Not Recommended)
```typescript
import { orders, payments, subscriptions } from '@better-giving/paypal-sdk';
```
**Result**: Includes all APIs, but still tree-shakeable at the export level.

## Size Comparison

| Import Method | Approximate Bundle Size | Tree-Shaking |
|--------------|------------------------|--------------|
| Single API (`/orders`) | ~50-100KB | ✅ Excellent |
| Two APIs (`/orders`, `/subscriptions`) | ~100-200KB | ✅ Excellent |
| All APIs (main export) | ~500KB-1MB | ⚠️ Partial |
| No tree-shaking | ~11MB | ❌ None |

## Verification with Bundlers

### Webpack
```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

### Rollup
```javascript
// rollup.config.js
export default {
  output: {
    format: 'esm'
  },
  treeshake: true
};
```

### Vite
Tree-shaking is enabled by default in production builds.

## Best Practices

1. **Import specific APIs**: Use `/orders`, `/payments`, etc.
2. **Import specific services**: Import `{ OrdersService }` instead of `*`
3. **Avoid barrel exports**: Don't re-export everything in your app
4. **Use production builds**: Development builds disable tree-shaking

## Technical Details

- **Format**: ESM (ES2020)
- **Module System**: Native ES modules
- **Target**: ES2020 (modern browsers & Node 14+)
- **Source Maps**: Included for debugging
- **Declaration Maps**: Included for IDE support
