# Publishing Guide for @better-giving/paypal-sdk

## Pre-Publishing Checklist

- [x] Package name: `@better-giving/paypal-sdk`
- [x] Using pnpm for package management
- [x] ESM format with tree-shaking support
- [x] TypeScript declarations included
- [x] Source maps and declaration maps generated
- [x] All 13 PayPal APIs generated successfully
- [x] Build passes without errors

## Package Statistics

- **Total dist size**: 22MB (includes source maps)
- **JavaScript files**: 1,346 files
- **TypeScript declarations**: 1,346 files
- **Tree-shakeable**: Yes (`"sideEffects": false`)
- **Format**: ESM (`"type": "module"`)

## Publishing to npm

### 1. Login to npm
```bash
npm login
# or
pnpm login
```

### 2. Test the Package Locally
```bash
# Create a tarball to see what will be published
pnpm pack

# This creates: better-giving-paypal-sdk-1.0.0.tgz
# Inspect it:
tar -tzf better-giving-paypal-sdk-1.0.0.tgz
```

### 3. Dry Run
```bash
pnpm publish --dry-run
```

### 4. Publish to npm
```bash
# First release (v1.0.0)
pnpm publish

# With specific tag
pnpm publish --tag beta
pnpm publish --tag latest
```

### 5. Verify Publication
```bash
# Check on npm
npm view @better-giving/paypal-sdk

# Test installation
pnpm add @better-giving/paypal-sdk
```

## Version Management

### Semantic Versioning

```bash
# Patch release (1.0.0 -> 1.0.1)
pnpm version patch
pnpm publish

# Minor release (1.0.0 -> 1.1.0)
pnpm version minor
pnpm publish

# Major release (1.0.0 -> 2.0.0)
pnpm version major
pnpm publish
```

### Pre-release Versions

```bash
# Beta release (1.0.0 -> 1.1.0-beta.0)
pnpm version preminor --preid=beta
pnpm publish --tag beta

# Release candidate
pnpm version prerelease --preid=rc
pnpm publish --tag next
```

## Automated Publishing

### Using GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install

      - run: pnpm run build

      - run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## What Gets Published

Only the `dist/` directory is published, as specified in `package.json`:

```json
{
  "files": ["dist"]
}
```

This includes:
- All compiled JavaScript files (`.js`)
- TypeScript declarations (`.d.ts`)
- Source maps (`.js.map`, `.d.ts.map`)
- Package metadata from `package.json`
- README.md

## Post-Publishing

### 1. Update Documentation
```bash
# Badge for README
[![npm version](https://badge.fury.io/js/@better-giving%2Fpaypal-sdk.svg)](https://www.npmjs.com/package/@better-giving/paypal-sdk)
```

### 2. Announce the Release
- GitHub Release notes
- Update changelog
- Social media announcement

### 3. Monitor Usage
```bash
# Check download stats
npm view @better-giving/paypal-sdk

# Check on npm website
https://www.npmjs.com/package/@better-giving/paypal-sdk
```

## Updating the SDK

When PayPal updates their OpenAPI specs:

```bash
# Pull latest specs
cd specs
git pull origin main
cd ..

# Rebuild
pnpm run build

# Bump version
pnpm version minor

# Publish
pnpm publish
```

## Troubleshooting

### Permission Denied
```bash
# Make sure you're logged in
pnpm login

# Check who you're logged in as
npm whoami

# Verify organization access
# Visit: https://www.npmjs.com/org/better-giving
```

### Package Already Exists
If the version already exists, bump the version:
```bash
pnpm version patch
pnpm publish
```

### Build Fails Before Publish
The `prepublishOnly` script runs automatically:
```json
{
  "scripts": {
    "prepublishOnly": "pnpm run build"
  }
}
```

## Access Control

### Making the Package Public
Already configured in `package.json`:
```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Making it Private (if needed)
```bash
pnpm publish --access restricted
```

Or update package.json:
```json
{
  "publishConfig": {
    "access": "restricted"
  }
}
```

## Unpublishing (Emergency Only)

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @better-giving/paypal-sdk@1.0.0

# Unpublish entire package (within 72 hours)
npm unpublish @better-giving/paypal-sdk --force
```

⚠️ **Warning**: Unpublishing is discouraged and has restrictions.

## Support

- npm registry: https://www.npmjs.com/package/@better-giving/paypal-sdk
- GitHub repository: https://github.com/AngelProtocolFinance/paypal-sdk
- Issues: https://github.com/AngelProtocolFinance/paypal-sdk/issues
