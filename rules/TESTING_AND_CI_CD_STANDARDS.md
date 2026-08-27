# 🧪 Testing & CI/CD Standards

## 1. Testing Pyramid
1. **Unit Tests (Vitest / Jest)**: Test business logic services, reducers, utility formatters, and validation schemas. Target **>80% coverage** on pure functions.
2. **Component Integration Tests (React Testing Library)**: Test user interactions, form submissions, and error states without mocking internal styling.
3. **End-to-End Tests (Playwright / Cypress)**: Test critical business flows (User Registration $\to$ OTP verification $\to$ Checkout $\to$ Order confirmation).

---

## 2. GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)

```yaml
name: CI Quality Gate

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```
