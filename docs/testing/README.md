# Testing Setup

This directory contains the basic test setup structure for the GreenMax project.

## Current Status

- ✅ Basic test utilities created
- ⏳ Test framework setup needed (Jest/Vitest)
- ⏳ Unit tests to be added
- ⏳ Integration tests to be added

## Recommended Test Framework

For Next.js projects, we recommend:

1. **Vitest** - Fast, Vite-native test runner
2. **Jest** - Popular, well-documented
3. **Playwright** - For E2E testing

## Test Structure

```
tests/
├── setup.ts          # Test utilities and helpers
├── unit/             # Unit tests (to be added)
│   ├── lib/
│   │   ├── emissions/
│   │   ├── saf/
│   │   └── rewards/
│   └── utils/
├── integration/      # Integration tests (to be added)
│   └── api/
└── e2e/              # End-to-end tests (to be added)
```

## Example Test (to be implemented)

```typescript
import { describe, it, expect } from 'vitest';
import { calculateSAFCost } from '@/lib/telegram/keyboardBuilders';

describe('calculateSAFCost', () => {
  it('should calculate correct cost for 50% SAF', () => {
    const cost = calculateSAFCost(1000, 50);
    expect(cost).toBeGreaterThan(0);
  });
});
```

## Running Tests

Once test framework is set up:

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

## Test Coverage Goals

- Unit tests: 80%+ coverage for business logic
- Integration tests: All API routes
- E2E tests: Critical user flows

---

**Note**: This is a basic structure. Add proper test framework and tests as needed.

