import { ApiClient, InstanceRole, InstanceUser, Options, WebsiteUser } from '../../src';

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

describe('InstanceUserMethods - Unit Tests', () => {
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

	describe('getUsers', () => {
		const mockUsers: WebsiteUser = {
			users: [
				{
					id: 1,
					firstName: 'John',
					lastName: 'Doe',
					emailAddress: 'john.doe@example.com',
					roles: [{ id: 1, name: 'Administrator', description: 'Admin role' }],
				},
				{
					id: 2,
					firstName: 'Jane',
					lastName: 'Smith',
					emailAddress: 'jane.smith@example.com',
					roles: [{ id: 2, name: 'Editor', description: 'Editor role' }],
				},
			],
		};

		it('should retrieve users list successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockUsers });

			// Act
			const result = await client.instanceUserMethods.getUsers(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'user/list',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockUsers);
		});

		it('should handle empty users list', async () => {
			// Arrange
			const emptyUsers: WebsiteUser = { users: [] };
			mockedAxiosInstance.get.mockResolvedValue({ data: emptyUsers });

			// Act
			const result = await client.instanceUserMethods.getUsers(testGuid);

			// Assert
			expect(result).toEqual(emptyUsers);
			expect(result.users).toHaveLength(0);
		});

		it('should handle API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.instanceUserMethods.getUsers(testGuid)).rejects.toThrow(
				'Unable to retrieve users.'
			);
		});
	});

	describe('saveUser', () => {
		const mockRoles: InstanceRole[] = [
			{ id: 1, name: 'Administrator', description: 'Admin role' },
			{ id: 2, name: 'Editor', description: 'Editor role' },
		];

		const mockUser: InstanceUser = {
			id: 123,
			firstName: 'John',
			lastName: 'Doe',
			emailAddress: 'john.doe@example.com',
			roles: mockRoles,
		};

		it('should create a new user successfully', async () => {
			// Arrange
			const emailAddress = 'john.doe@example.com';
			const firstName = 'John';
			const lastName = 'Doe';
			mockedAxiosInstance.post.mockResolvedValue({ data: mockUser });

			// Act
			const result = await client.instanceUserMethods.saveUser(
				emailAddress,
				mockRoles,
				testGuid,
				firstName,
				lastName
			);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`user/save?emailAddress=${emailAddress}&firstName=${firstName}&lastName=${lastName}`,
				mockRoles,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockUser);
		});

		it('should create user without optional names', async () => {
			// Arrange
			const emailAddress = 'jane.smith@example.com';
			mockedAxiosInstance.post.mockResolvedValue({ data: mockUser });

			// Act
			const result = await client.instanceUserMethods.saveUser(emailAddress, mockRoles, testGuid);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`user/save?emailAddress=${emailAddress}&firstName=undefined&lastName=undefined`,
				mockRoles,
				expect.any(Object)
			);
			expect(result).toEqual(mockUser);
		});

		it('should handle save user errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid user data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.instanceUserMethods.saveUser('invalid-email', mockRoles, testGuid)
			).rejects.toThrow('Unable to retrieve users.');
		});
	});

	describe('deleteUser', () => {
		it('should delete user successfully', async () => {
			// Arrange
			const userId = 123;
			const deleteResponse = 'User deleted successfully';
			mockedAxiosInstance.delete.mockResolvedValue({ data: deleteResponse });

			// Act
			const result = await client.instanceUserMethods.deleteUser(userId, testGuid);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`user/delete/${userId}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toBe(deleteResponse);
		});

		it('should handle delete user errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'User not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.instanceUserMethods.deleteUser(999, testGuid)).rejects.toThrow(
				'Unable to delete the user for id: 999'
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
				await client.instanceUserMethods.getUsers(testGuid);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve users.');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.instanceUserMethods.getUsers(testGuid)).rejects.toThrow(
				'Unable to retrieve users.'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: { users: [] } });

			// Act
			await client.instanceUserMethods.getUsers(testGuid);

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
			mockedAxiosInstance.get.mockResolvedValue({ data: { users: [] } });

			// Act
			await client.instanceUserMethods.getUsers(differentGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'user/list',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
