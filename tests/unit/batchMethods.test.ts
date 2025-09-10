import { ApiClient, Batch, Options } from '../../src';

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

describe('BatchMethods - Unit Tests', () => {
	let client: ApiClient;
	const testGuid = 'test-guid-123';

	beforeEach(() => {
		jest.clearAllMocks();
		mockedAxiosInstance.get.mockClear();
		mockedAxiosInstance.post.mockClear();
		mockedAxiosInstance.put.mockClear();
		mockedAxiosInstance.delete.mockClear();

		const options: Options = {
			token: 'test-bearer-token',
			baseUrl: 'https://test-api.agility.io',
		};
		client = new ApiClient(options);
	});

	describe('getBatch', () => {
		const mockBatch: Batch = {
			id: 123,
			name: 'Test Batch',
			batchState: 1,
			items: [],
			createdDate: '2025-01-10T10:00:00Z',
			lastModifiedDate: '2025-01-10T10:30:00Z',
		};

		it('should retrieve batch by ID successfully with default expandItems', async () => {
			// Arrange
			const batchId = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockBatch });

			// Act
			const result = await client.batchMethods.getBatch(batchId, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`batch/${batchId}?expandItems=true`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockBatch);
		});

		it('should retrieve batch by ID with expandItems false', async () => {
			// Arrange
			const batchId = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockBatch });

			// Act
			const result = await client.batchMethods.getBatch(batchId, testGuid, false);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`batch/${batchId}?expandItems=false`,
				expect.any(Object)
			);
			expect(result).toEqual(mockBatch);
		});

		it('should handle batch not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Batch not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.getBatch(999, testGuid)).rejects.toThrow(
				'Unable to retrieve the batch for id: 999'
			);
		});
	});

	describe('publishBatch', () => {
		it('should publish batch successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 123;
			const resultBatchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: resultBatchId });

			// Act
			const result = await client.batchMethods.publishBatch(batchId, testGuid, true);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`batch/${batchId}/publish`,
				null,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toBe(resultBatchId);
		});

		it('should handle publish batch errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid batch for publishing' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.publishBatch(123, testGuid, true)).rejects.toThrow(
				'Unable to publish the batch with id: 123'
			);
		});
	});

	describe('unpublishBatch', () => {
		it('should unpublish batch successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 123;
			const resultBatchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: resultBatchId });

			// Act
			const result = await client.batchMethods.unpublishBatch(batchId, testGuid, true);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`batch/${batchId}/unpublish`,
				null,
				expect.any(Object)
			);
			expect(result).toBe(resultBatchId);
		});

		it('should handle unpublish batch errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid batch for unpublishing' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.unpublishBatch(123, testGuid, true)).rejects.toThrow(
				'Unable to unpublish the batch with id: 123'
			);
		});
	});

	describe('approveBatch', () => {
		it('should approve batch successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 123;
			const resultBatchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: resultBatchId });

			// Act
			const result = await client.batchMethods.approveBatch(batchId, testGuid, true);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`batch/${batchId}/approve`,
				null,
				expect.any(Object)
			);
			expect(result).toBe(resultBatchId);
		});

		it('should handle approve batch errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid batch for approval' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.approveBatch(123, testGuid, true)).rejects.toThrow(
				'Unable to approve the batch with id: 123'
			);
		});
	});

	describe('declineBatch', () => {
		it('should decline batch successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 123;
			const resultBatchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: resultBatchId });

			// Act
			const result = await client.batchMethods.declineBatch(batchId, testGuid, true);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`batch/${batchId}/decline`,
				null,
				expect.any(Object)
			);
			expect(result).toBe(resultBatchId);
		});

		it('should handle decline batch errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid batch for declining' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.declineBatch(123, testGuid, true)).rejects.toThrow(
				'Unable to decline the batch with id: 123'
			);
		});
	});

	describe('requestApprovalBatch', () => {
		it('should request approval for batch successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 123;
			const resultBatchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: resultBatchId });

			// Act
			const result = await client.batchMethods.requestApprovalBatch(batchId, testGuid, true);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`batch/${batchId}/request-approval`,
				null,
				expect.any(Object)
			);
			expect(result).toBe(resultBatchId);
		});

		it('should handle request approval batch errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid batch for requesting approval' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.requestApprovalBatch(123, testGuid, true)).rejects.toThrow(
				'Unable to request approval for the batch with id: 123'
			);
		});
	});

	describe('getBatchTypes', () => {
		const mockBatchTypes = {
			itemTypes: [
				{ name: 'Content', value: 1 },
				{ name: 'Page', value: 2 },
			],
			workflowOperations: [
				{ name: 'Publish', value: 1 },
				{ name: 'Unpublish', value: 2 },
			],
			batchStates: [
				{ name: 'Pending', value: 0 },
				{ name: 'Processing', value: 1 },
				{ name: 'Processed', value: 2 },
			],
		};

		it('should retrieve batch types successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockBatchTypes });

			// Act
			const result = await client.batchMethods.getBatchTypes(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'batch/types',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockBatchTypes);
		});

		it('should handle getBatchTypes errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.batchMethods.getBatchTypes(testGuid)).rejects.toThrow(
				'Unable to retrieve batch types'
			);
		});
	});

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
				await client.batchMethods.getBatch(123, testGuid);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve the batch for id: 123');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.batchMethods.getBatch(123, testGuid)).rejects.toThrow(
				'Unable to retrieve the batch for id: 123'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.batchMethods.getBatchTypes(testGuid);

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
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.batchMethods.getBatchTypes(differentGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'batch/types',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
