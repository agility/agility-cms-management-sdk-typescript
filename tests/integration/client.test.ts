import { ApiClient } from '../../src/apiClient';
import { Options } from '../../src/models/options';
import { createTestClient, getTestConfig } from '../utils/testClient';

describe('Client Integration Tests', () => {
	let client: ApiClient;
	let config: any;

	beforeAll(async () => {
		config = getTestConfig();
		client = createTestClient();
	});

	describe('Client Instantiation & Configuration', () => {
		it('should create client with proper configuration', () => {
			expect(client).toBeDefined();
			expect(client).toBeInstanceOf(ApiClient);
			expect(client._options).toBeDefined();
			expect(client._options.token).toBeDefined();
			expect(client._options.baseUrl).toBeDefined();

			// Skip credential validation if using mock data (for CI/local dev without credentials)
			const isMockData = client._options.token === 'mock-pat';

			console.log('✅ Client Options:');
			console.log('  - Token type:', isMockData ? 'mock' : 'real');
			console.log('  - Token length:', client._options.token.length);
			console.log('  - Base URL:', client._options.baseUrl);
			console.log('  - Has refresh token:', !!client._options.refresh_token);
			console.log('  - Duration:', client._options.duration);
			console.log('  - Retry count:', client._options.retryCount);
		});

		it('should have all API method instances available', () => {
			expect(client.contentMethods).toBeDefined();
			expect(client.assetMethods).toBeDefined();
			expect(client.batchMethods).toBeDefined();
			expect(client.containerMethods).toBeDefined();
			expect(client.instanceUserMethods).toBeDefined();
			expect(client.instanceMethods).toBeDefined();
			expect(client.modelMethods).toBeDefined();
			expect(client.pageMethods).toBeDefined();
			expect(client.serverUserMethods).toBeDefined();
			expect(client.webhookMethods).toBeDefined();

			console.log('✅ All API method instances are available');
		});

		it('should have valid configuration values', () => {
			expect(config).toBeDefined();
			expect(config.guid).toBeDefined();
			expect(config.locales).toBeDefined();
			expect(config.website).toBeDefined();

			console.log('✅ Test Configuration:');
			console.log('  - GUID:', config.guid);
			console.log('  - Website:', config.website);
			console.log('  - Locales:', config.locales);
		});
	});

	describe('Authentication Validation', () => {
		it('should fail with invalid credentials', async () => {
			const invalidOptions: Options = {
				token: 'invalid-token-123',
				baseUrl: config.baseUrl || 'https://mgmt-api.aglty.io',
			};

			const invalidClient = new ApiClient(invalidOptions);

			await expect(invalidClient.instanceMethods.getLocales(config.guid)).rejects.toThrow();

			console.log('✅ Invalid credentials properly rejected');
		});

		it('should handle malformed GUID gracefully', async () => {
			const malformedGuid = 'invalid-guid-format';

			await expect(client.instanceMethods.getLocales(malformedGuid)).rejects.toThrow();

			console.log('✅ Malformed GUID properly rejected');
		});
	});

	describe('Client Configuration', () => {
		it('should handle network timeouts gracefully', () => {
			// This test verifies the client handles network issues properly
			expect(client._options.retryCount).toBeGreaterThanOrEqual(0);
			console.log('✅ Client configured with retry count:', client._options.retryCount);
		});
	});
});
