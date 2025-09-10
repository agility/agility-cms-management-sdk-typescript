# Agility CMS Management SDK Test Suite

This directory contains a comprehensive test suite for the Agility CMS Management SDK with 100% test coverage across all API method classes.

## Test Architecture

Our test suite follows a two-tier approach for optimal coverage and maintainability:

### 🎯 **Unit Tests** (174 tests)
Complete mock-based testing of all SDK business logic:

```
tests/unit/
├── assetMethods.test.ts        # Asset & gallery operations
├── batchMethods.test.ts        # Batch operations
├── containerMethods.test.ts    # Container management
├── contentMethods.test.ts      # Content operations
├── instanceMethods.test.ts     # Instance operations
├── instanceUserMethods.test.ts # Instance user management
├── modelMethods.test.ts        # Model operations
├── pageMethods.test.ts         # Page operations
├── serverUserMethods.test.ts   # Server user operations
└── webhookMethods.test.ts      # Webhook operations
```

### 🔌 **Integration Tests** (14 tests)
Essential authentication and connectivity validation:

```
tests/integration/
├── client.test.ts              # Client instantiation & auth validation
└── endpointDiagnostic.test.ts  # Basic API connectivity checks
```

## Coverage Statistics

- **Total Tests**: 188/188 passing (100%)
- **Unit Coverage**: 10/10 API method classes (100%)
- **Integration Coverage**: Authentication + connectivity validation
- **Execution Time**: ~1.6s (fast CI/CD friendly)

## Test Strategy

### ✅ **What We Test**
- **Unit Tests**: All SDK business logic with comprehensive mocking
- **Integration Tests**: Authentication, client setup, basic connectivity
- **Error Handling**: Network failures, invalid credentials, malformed data
- **Configuration**: Headers, retries, different environments

### ❌ **What We Don't Test**
- Complex end-to-end workflows (covered by unit tests)
- Data cleanup/teardown (not needed with mocking)
- Flaky asset upload scenarios (mocked for reliability)

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run specific test suites
npm run test:unit:models
npm run test:unit:assets
npm run test:unit:content
# ... etc for each API class
```

## Environment Setup

For integration tests, create a `.env.test` file:

```bash
AGILITY_PAT=your-personal-access-token
AGILITY_GUID=your-instance-guid
AGILITY_WEBSITE=your-website-name
AGILITY_LOCALES=en-us
```

## Test Configuration

- **Jest Config**: `jest.config.js` - Streamlined test runner setup
- **Setup File**: `setup.ts` - Global test environment configuration
- **Test Client**: `utils/testClient.ts` - Standardized client creation
- **No Global Setup/Teardown**: Removed unnecessary complexity

## Architecture Benefits

✅ **Fast Execution**: Unit tests run in milliseconds with mocks
✅ **Reliable**: No dependency on external API state
✅ **Comprehensive**: Every API method and error path covered
✅ **Maintainable**: Clear separation of concerns
✅ **CI/CD Ready**: Consistent results across environments

This architecture provides enterprise-grade test coverage while maintaining speed and reliability for continuous integration pipelines.
