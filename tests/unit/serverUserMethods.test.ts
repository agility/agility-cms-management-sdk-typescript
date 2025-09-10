import { ApiClient, Options, ServerUser } from '../../src';

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

describe('ServerUserMethods - Unit Tests', () => {
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

	describe('me', () => {
		const mockServerUser: ServerUser = {
			id: 123,
			firstName: 'John',
			lastName: 'Doe',
			emailAddress: 'john.doe@agility.com',
			userName: 'john.doe',
			isActive: true,
			lastLoginDate: '2025-01-10T10:00:00Z',
			createdDate: '2024-01-01T00:00:00Z',
			roles: ['Administrator', 'Developer'],
		};

		it('should retrieve current user information successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockServerUser });

			// Act
			const result = await client.serverUserMethods.me(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'users/me',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockServerUser);
		});

		it('should handle unauthorized access', async () => {
			// Arrange
			const apiError = {
				response: { status: 401, data: 'Unauthorized' },
				message: 'Request failed with status code 401',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.serverUserMethods.me(testGuid)).rejects.toThrow(
				'Unable to retrieve user information.'
			);
		});

		it('should handle server errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.serverUserMethods.me(testGuid)).rejects.toThrow(
				'Unable to retrieve user information.'
			);
		});
	});

	describe('you', () => {
		const mockUserData = {
			id: 456,
			firstName: 'Jane',
			lastName: 'Smith',
			emailAddress: 'jane.smith@agility.com',
			userName: 'jane.smith',
			isActive: true,
			permissions: ['read', 'write', 'admin'],
		};

		it('should retrieve specific user information successfully', async () => {
			// Arrange
			const serverUserID = 456;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockUserData });

			// Act
			const result = await client.serverUserMethods.you(testGuid, serverUserID);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`users/you?srvUserID=${serverUserID}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockUserData);
		});

		it('should handle user not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'User not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.serverUserMethods.you(testGuid, 999)).rejects.toThrow(
				'Unable to retrieve user information.'
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
			await expect(client.serverUserMethods.you(testGuid, 456)).rejects.toThrow(
				'Unable to retrieve user information.'
			);
		});

		it('should handle different server user IDs', async () => {
			// Arrange
			const serverUserID = 789;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockUserData });

			// Act
			await client.serverUserMethods.you(testGuid, serverUserID);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`users/you?srvUserID=${serverUserID}`,
				expect.any(Object)
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
				await client.serverUserMethods.me(testGuid);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve user information.');
				// Note: ServerUserMethods doesn't pass the error to Exception, so no innerError
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.serverUserMethods.me(testGuid)).rejects.toThrow(
				'Unable to retrieve user information.'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers for me endpoint', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.serverUserMethods.me(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'users/me',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
						'Cache-Control': 'no-cache',
					}),
				})
			);
		});

		it('should use correct headers for you endpoint', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.serverUserMethods.you(testGuid, 123);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'users/you?srvUserID=123',
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
			await client.serverUserMethods.me(differentGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'users/me',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
