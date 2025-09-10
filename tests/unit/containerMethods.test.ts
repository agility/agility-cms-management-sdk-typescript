import { ApiClient, Container, Options } from '../../src';

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

describe('ContainerMethods - Unit Tests', () => {
	let client: ApiClient;
	const testGuid = 'test-guid-123';

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();
		mockedAxiosInstance.get.mockClear();
		mockedAxiosInstance.post.mockClear();
		mockedAxiosInstance.put.mockClear();
		mockedAxiosInstance.delete.mockClear();

		// Create client with test configuration
		const options = new Options();
		options.token = 'test-bearer-token';
		options.baseUrl = 'https://test-api.agilitycms.com';
		client = new ApiClient(options);
	});

	describe('getContainerList', () => {
		const mockContainers = [
			{
				id: 1,
				displayName: 'Main Container',
				referenceName: 'MainContainer',
				description: 'Primary content container',
				isPublished: true,
			},
			{
				id: 2,
				displayName: 'Secondary Container',
				referenceName: 'SecondaryContainer',
				description: 'Secondary content container',
				isPublished: false,
			},
		];

		it('should retrieve container list successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockContainers });

			// Act
			const result = await client.containerMethods.getContainerList(testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'container/list',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockContainers);
			expect(result).toHaveLength(2);
		});

		it('should handle empty container list', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			const result = await client.containerMethods.getContainerList(testGuid);

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
			await expect(client.containerMethods.getContainerList(testGuid)).rejects.toThrow(
				'Unable to retrieve the container list'
			);
		});
	});

	describe('getContainerByID', () => {
		const mockContainer: Container = {
			id: 123,
			displayName: 'Test Container',
			referenceName: 'TestContainer',
			description: 'Test container description',
			isPublished: true,
			lastModifiedDate: '2025-01-10T10:00:00Z',
			lastModifiedBy: 'test-user',
			contentViewFields: [],
			sortFields: [],
		};

		it('should retrieve container by ID successfully', async () => {
			// Arrange
			const containerId = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockContainer });

			// Act
			const result = await client.containerMethods.getContainerByID(containerId, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`container/${containerId}`,
				expect.any(Object)
			);
			expect(result).toEqual(mockContainer);
			expect(result.id).toBe(containerId);
		});

		it('should handle container not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Container not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.containerMethods.getContainerByID(999, testGuid)).rejects.toThrow(
				'Unable to retrieve the container for id: 999'
			);
		});
	});

	describe('getContainerByReferenceName', () => {
		const mockContainer: Container = {
			id: 456,
			displayName: 'Reference Container',
			referenceName: 'ReferenceContainer',
			description: 'Container found by reference name',
			isPublished: true,
			lastModifiedDate: '2025-01-10T11:00:00Z',
			lastModifiedBy: 'test-user',
			contentViewFields: [],
			sortFields: [],
		};

		it('should retrieve container by reference name successfully', async () => {
			// Arrange
			const referenceName = 'ReferenceContainer';
			mockedAxiosInstance.get.mockResolvedValue({ data: mockContainer });

			// Act
			const result = await client.containerMethods.getContainerByReferenceName(
				referenceName,
				testGuid
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`container/${referenceName}`,
				expect.any(Object)
			);
			expect(result).toEqual(mockContainer);
			expect(result.referenceName).toBe(referenceName);
		});

		it('should handle reference name not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Reference name not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act
			const result = await client.containerMethods.getContainerByReferenceName(
				'NonExistent',
				testGuid
			);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe('saveContainer', () => {
		const mockContainer: Container = {
			id: null,
			displayName: 'New Container',
			referenceName: 'NewContainer',
			description: 'Newly created container',
			isPublished: false,
			lastModifiedDate: null,
			lastModifiedBy: null,
			contentViewFields: [
				{
					name: 'Title',
					label: 'Title',
					visible: true,
					sortable: true,
				},
			],
			sortFields: [
				{
					name: 'Title',
					direction: 'ASC',
				},
			],
		};

		it('should create a new container successfully', async () => {
			// Arrange
			const mockResponse = {
				data: {
					...mockContainer,
					id: 789,
					lastModifiedDate: '2025-01-10T12:00:00Z',
					lastModifiedBy: 'test-user',
				},
			};

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.containerMethods.saveContainer(mockContainer, testGuid);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'container',
				mockContainer,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockResponse.data);
			expect(result.id).toBe(789);
		});

		it('should update an existing container', async () => {
			// Arrange
			const existingContainer = { ...mockContainer, id: 456, description: 'Updated description' };
			const mockResponse = { data: existingContainer };

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.containerMethods.saveContainer(existingContainer, testGuid);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'container',
				existingContainer,
				expect.any(Object)
			);
			expect(result.description).toBe('Updated description');
		});

		it('should handle save container errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid container data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.containerMethods.saveContainer(mockContainer, testGuid)).rejects.toThrow(
				'Unable to save the container'
			);
		});
	});

	describe('deleteContainer', () => {
		it('should delete container successfully', async () => {
			// Arrange
			const containerId = 123;
			mockedAxiosInstance.delete.mockResolvedValue({ data: 'Container deleted' });

			// Act
			const result = await client.containerMethods.deleteContainer(containerId, testGuid);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`container/${containerId}`,
				expect.any(Object)
			);
			expect(result).toBe('Container deleted');
		});

		it('should handle delete errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot delete container with content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.containerMethods.deleteContainer(123, testGuid)).rejects.toThrow(
				'Unable to delete the container for id: 123'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			await client.containerMethods.getContainerList(testGuid);

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
			await client.containerMethods.getContainerList(differentGuid);

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
				await client.containerMethods.getContainerByID(123, testGuid);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve the container for id: 123');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.containerMethods.getContainerByID(123, testGuid)).rejects.toThrow(
				'Unable to retrieve the container for id: 123'
			);
		});
	});
});
