import { ApiClient, Locales, Options } from '../../src';

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

describe('InstanceMethods - Unit Tests', () => {
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

	describe('getLocales', () => {
		const mockLocales: Locales = {
			locales: [
				{
					code: 'en-us',
					name: 'English (United States)',
					isDefault: true,
					isActive: true,
				},
				{
					code: 'fr-ca',
					name: 'French (Canada)',
					isDefault: false,
					isActive: true,
				},
				{
					code: 'es-mx',
					name: 'Spanish (Mexico)',
					isDefault: false,
					isActive: false,
				},
			],
		};

		it('should retrieve locales successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockLocales });

			// Act
			const result = await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'locales',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockLocales);
		});

		it('should handle empty locales', async () => {
			// Arrange
			const emptyLocales: Locales = { locales: [] };
			mockedAxiosInstance.get.mockResolvedValue({ data: emptyLocales });

			// Act
			const result = await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(result).toEqual(emptyLocales);
			expect(result.locales).toHaveLength(0);
		});

		it('should handle single locale', async () => {
			// Arrange
			const singleLocale: Locales = {
				locales: [
					{
						code: 'en-us',
						name: 'English (United States)',
						isDefault: true,
						isActive: true,
					},
				],
			};
			mockedAxiosInstance.get.mockResolvedValue({ data: singleLocale });

			// Act
			const result = await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(result).toEqual(singleLocale);
			expect(result.locales).toHaveLength(1);
			expect(result.locales[0].isDefault).toBe(true);
		});

		it('should handle API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.instanceMethods.getLocales(testGuid)).rejects.toThrow(
				'Unable to retrieve locales.'
			);
		});

		it('should handle unauthorized access', async () => {
			// Arrange
			const apiError = {
				response: { status: 401, data: 'Unauthorized' },
				message: 'Request failed with status code 401',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.instanceMethods.getLocales(testGuid)).rejects.toThrow(
				'Unable to retrieve locales.'
			);
		});

		it('should handle forbidden access', async () => {
			// Arrange
			const apiError = {
				response: { status: 403, data: 'Forbidden' },
				message: 'Request failed with status code 403',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.instanceMethods.getLocales(testGuid)).rejects.toThrow(
				'Unable to retrieve locales.'
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
				await client.instanceMethods.getLocales(testGuid);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve locales.');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.instanceMethods.getLocales(testGuid)).rejects.toThrow(
				'Unable to retrieve locales.'
			);
		});

		it('should handle timeout errors', async () => {
			// Arrange
			const timeoutError = {
				code: 'ECONNABORTED',
				message: 'timeout of 5000ms exceeded',
			};
			mockedAxiosInstance.get.mockRejectedValue(timeoutError);

			// Act & Assert
			await expect(client.instanceMethods.getLocales(testGuid)).rejects.toThrow(
				'Unable to retrieve locales.'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: { locales: [] } });

			// Act
			await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'locales',
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
			mockedAxiosInstance.get.mockResolvedValue({ data: { locales: [] } });

			// Act
			await client.instanceMethods.getLocales(differentGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'locales',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});

		it('should work with different base URLs', async () => {
			// Arrange
			const customOptions: Options = {
				token: 'custom-token',
				baseUrl: 'https://custom-api.agility.io',
			};
			const customClient = new ApiClient(customOptions);
			mockedAxiosInstance.get.mockResolvedValue({ data: { locales: [] } });

			// Act
			await customClient.instanceMethods.getLocales(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'locales',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer custom-token',
					}),
				})
			);
		});
	});

	describe('Data Validation', () => {
		it('should handle locales with all properties', async () => {
			// Arrange
			const complexLocales: Locales = {
				locales: [
					{
						code: 'en-us',
						name: 'English (United States)',
						isDefault: true,
						isActive: true,
					},
					{
						code: 'fr-ca',
						name: 'French (Canada)',
						isDefault: false,
						isActive: true,
					},
				],
			};
			mockedAxiosInstance.get.mockResolvedValue({ data: complexLocales });

			// Act
			const result = await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(result.locales).toHaveLength(2);
			expect(result.locales[0].code).toBe('en-us');
			expect(result.locales[0].isDefault).toBe(true);
			expect(result.locales[1].code).toBe('fr-ca');
			expect(result.locales[1].isDefault).toBe(false);
		});

		it('should handle locales with special characters', async () => {
			// Arrange
			const specialLocales: Locales = {
				locales: [
					{
						code: 'zh-cn',
						name: '中文 (简体)',
						isDefault: false,
						isActive: true,
					},
					{
						code: 'ar-sa',
						name: 'العربية (السعودية)',
						isDefault: false,
						isActive: true,
					},
				],
			};
			mockedAxiosInstance.get.mockResolvedValue({ data: specialLocales });

			// Act
			const result = await client.instanceMethods.getLocales(testGuid);

			// Assert
			expect(result.locales).toHaveLength(2);
			expect(result.locales[0].name).toBe('中文 (简体)');
			expect(result.locales[1].name).toBe('العربية (السعودية)');
		});
	});
});
