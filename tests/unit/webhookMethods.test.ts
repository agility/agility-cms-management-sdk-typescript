import { ApiClient, Options, Webhook } from '../../src';

// Mock axios.create to return our controlled instance
const mockedAxiosInstance = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
	defaults: { headers: { common: {} } },
};

jest.mock('axios', () => ({
	create: jest.fn(() => mockedAxiosInstance),
}));

describe('WebhookMethods - Unit Tests', () => {
	let client: ApiClient;
	const testGuid = 'test-guid-123';

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();
		mockedAxiosInstance.get.mockReset();
		mockedAxiosInstance.post.mockReset();
		mockedAxiosInstance.put.mockReset();
		mockedAxiosInstance.delete.mockReset();

		// Create client with test configuration
		const options = new Options();
		options.token = 'test-bearer-token';
		options.baseUrl = 'https://test-api.agilitycms.com';
		client = new ApiClient(options);
	});

	describe('getWebhooks', () => {
		const mockWebhooks: Webhook[] = [
			{
				id: 1,
				name: 'Content Webhook',
				url: 'https://example.com/webhook/content',
				events: ['content.created', 'content.updated'],
				isActive: true,
				secret: 'webhook-secret-123',
				createdDate: '2025-01-10T10:00:00Z',
				lastModifiedDate: '2025-01-10T10:00:00Z',
			},
			{
				id: 2,
				name: 'Page Webhook',
				url: 'https://example.com/webhook/page',
				events: ['page.published', 'page.unpublished'],
				isActive: false,
				secret: 'webhook-secret-456',
				createdDate: '2025-01-10T11:00:00Z',
				lastModifiedDate: '2025-01-10T11:00:00Z',
			},
		];

		it('should retrieve webhooks list successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockWebhooks });

			// Act
			const result = await client.webhookMethods.webhookList(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'webhook/list',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockWebhooks);
			expect(result).toHaveLength(2);
		});

		it('should handle empty webhooks list', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			const result = await client.webhookMethods.webhookList(testGuid);

			// Assert
			expect(result).toEqual([]);
			expect(result).toHaveLength(0);
		});

		it('should handle API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.webhookMethods.webhookList(testGuid)).rejects.toThrow(
				'Unable to get the webhook list'
			);
		});
	});

	describe('getWebhook', () => {
		const mockWebhook: Webhook = {
			id: 123,
			name: 'Test Webhook',
			url: 'https://example.com/webhook/test',
			events: ['content.created', 'content.updated'],
			isActive: true,
			secret: 'webhook-secret-test',
			createdDate: '2025-01-10T10:00:00Z',
			lastModifiedDate: '2025-01-10T10:00:00Z',
		};

		it('should retrieve webhook by ID successfully', async () => {
			// Arrange
			const webhookId = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockWebhook });

			// Act
			const result = await client.webhookMethods.getWebhook(testGuid, webhookId);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`webhook/${webhookId}`,
				expect.any(Object)
			);
			expect(result).toEqual(mockWebhook);
			expect(result.id).toBe(webhookId);
		});

		it('should handle webhook not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Webhook not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.webhookMethods.getWebhook(testGuid, 999)).rejects.toThrow(
				'Unable to retrieve webhook for webhookID: 999,'
			);
		});
	});

	describe('saveWebhook', () => {
		const mockWebhook: Webhook = {
			id: 0,
			name: 'New Webhook',
			url: 'https://example.com/webhook/new',
			events: ['content.created'],
			isActive: true,
			secret: 'new-webhook-secret',
			createdDate: null,
			lastModifiedDate: null,
		};

		it('should create a new webhook successfully', async () => {
			// Arrange
			const mockResponse = {
				data: {
					...mockWebhook,
					id: 789,
					createdDate: '2025-01-10T12:00:00Z',
					lastModifiedDate: '2025-01-10T12:00:00Z',
				},
			};

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.webhookMethods.saveWebhook(testGuid, mockWebhook);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'webhook',
				mockWebhook,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockResponse.data);
			expect(result.id).toBe(789);
		});

		it('should update an existing webhook', async () => {
			// Arrange
			const existingWebhook = {
				...mockWebhook,
				id: 456,
				name: 'Updated Webhook',
			};
			const mockResponse = { data: existingWebhook };

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.webhookMethods.saveWebhook(testGuid, existingWebhook);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'webhook',
				existingWebhook,
				expect.any(Object)
			);
			expect(result.name).toBe('Updated Webhook');
		});

		it('should handle save webhook errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid webhook data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.webhookMethods.saveWebhook(testGuid, mockWebhook)).rejects.toThrow(
				'Unable to save webhook.'
			);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			// Arrange
			const webhookId = 123;
			mockedAxiosInstance.delete.mockResolvedValue({ data: 'Webhook deleted' });

			// Act
			await client.webhookMethods.deleteWebhook(testGuid, webhookId);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`webhook/${webhookId}`,
				expect.any(Object)
			);
			// WebhookMethods.deleteWebhook returns void, not a string
		});

		it('should handle delete errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot delete active webhook' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.webhookMethods.deleteWebhook(testGuid, 123)).rejects.toThrow(
				'Unable to delete webhook for webhookID: 123.'
			);
		});
	});

	// Removed non-existent methods: testWebhook, getWebhookLogs, activateWebhook, deactivateWebhook

	describe('Error Handling', () => {
		it('should preserve error details in exceptions', async () => {
			// Arrange
			const apiError = {
				response: {
					status: 403,
					data: { message: 'Insufficient permissions', code: 'FORBIDDEN' },
				},
				message: 'Request failed with status code 403',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			try {
				await client.webhookMethods.getWebhook(testGuid, 123);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve webhook for webhookID: 123,');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.webhookMethods.getWebhook(testGuid, 123)).rejects.toThrow(
				'Unable to retrieve webhook for webhookID: 123,'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			await client.webhookMethods.webhookList(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
						'Cache-Control': 'no-cache',
					}),
				})
			);
		});

		it('should handle different GUID formats', async () => {
			// Arrange
			const differentGuid = 'different-guid-456';
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			await client.webhookMethods.webhookList(differentGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
