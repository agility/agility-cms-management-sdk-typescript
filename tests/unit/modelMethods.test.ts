import axios from 'axios';

import { ApiClient, Model, Options } from '../../src';

// Mock axios
jest.mock('axios', () => ({
	create: jest.fn(() => ({
		get: jest.fn(),
		post: jest.fn(),
		put: jest.fn(),
		delete: jest.fn(),
		defaults: { headers: { common: {} } },
	})),
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosInstance = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
	defaults: { headers: { common: {} } },
};

// Mock axios.create to return our mocked instance
(mockedAxios.create as jest.Mock).mockReturnValue(mockedAxiosInstance);

describe('ModelMethods - Unit Tests', () => {
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

	describe('saveModel', () => {
		const mockModel: Model = {
			id: null,
			displayName: 'Test Content Model',
			referenceName: 'TestContentModel',
			description: 'Test model description',
			lastModifiedDate: null,
			lastModifiedBy: null,
			lastModifiedAuthorID: null,
			allowTagging: false,
			contentDefinitionTypeName: null,
			isPublished: null,
			wasUnpublished: null,
			fields: [
				{
					name: 'Title',
					label: 'Title',
					type: 'Text',
					description: 'Content title',
					designerOnly: false,
					isDataField: true,
					editable: true,
					hiddenField: false,
					fieldID: null,
					itemOrder: 1,
					labelHelpDescription: '',
					settings: { required: 'true' },
				},
			],
		};

		it('should successfully create a new model', async () => {
			// Arrange
			const mockResponse = {
				data: {
					...mockModel,
					id: 123,
					lastModifiedDate: '2025-01-10T10:00:00Z',
					lastModifiedBy: 'test-user',
				},
			};

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.modelMethods.saveModel(mockModel, testGuid);

			// Assert - Verify API call
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'model',
				mockModel,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
						'Cache-Control': 'no-cache',
					}),
				})
			);

			// Assert - Verify result
			expect(result).toEqual(mockResponse.data);
			expect(result.id).toBe(123);
			expect(result.displayName).toBe('Test Content Model');
		});

		it('should successfully update an existing model', async () => {
			// Arrange
			const existingModel = { ...mockModel, id: 456 };
			const mockResponse = {
				data: {
					...existingModel,
					lastModifiedDate: '2025-01-10T11:00:00Z',
				},
			};

			mockedAxiosInstance.post.mockResolvedValue(mockResponse);

			// Act
			const result = await client.modelMethods.saveModel(existingModel, testGuid);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				'model',
				existingModel,
				expect.any(Object)
			);
			expect(result.id).toBe(456);
		});

		it('should handle API errors correctly', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid model data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.modelMethods.saveModel(mockModel, testGuid)).rejects.toThrow(
				'Unable to save the model.'
			);
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxios.post.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.modelMethods.saveModel(mockModel, testGuid)).rejects.toThrow(
				'Unable to save the model.'
			);
		});
	});

	describe('getContentModel', () => {
		it('should retrieve model by ID successfully', async () => {
			// Arrange
			const modelId = 123;
			const mockResponse = {
				data: {
					id: modelId,
					displayName: 'Retrieved Model',
					referenceName: 'RetrievedModel',
					fields: [],
				},
			};

			mockedAxiosInstance.get.mockResolvedValue(mockResponse);

			// Act
			const result = await client.modelMethods.getContentModel(modelId, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`model/${modelId}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockResponse.data);
			expect(result.id).toBe(modelId);
		});

		it('should handle model not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Model not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.modelMethods.getContentModel(999, testGuid)).rejects.toThrow(
				'Unable to retrieve model for id: 999.'
			);
		});
	});

	describe('getContentModules', () => {
		const mockModels = [
			{ id: 1, displayName: 'Model 1', referenceName: 'Model1' },
			{ id: 2, displayName: 'Model 2', referenceName: 'Model2' },
		];

		it('should retrieve content modules with defaults', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockModels });

			// Act
			const result = await client.modelMethods.getContentModules(true, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'model/list/true?includeModules=false',
				expect.any(Object)
			);
			expect(result).toEqual(mockModels);
			expect(result).toHaveLength(2);
		});

		it('should retrieve content modules without defaults', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockModels });

			// Act
			const result = await client.modelMethods.getContentModules(false, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'model/list/false?includeModules=false',
				expect.any(Object)
			);
			expect(result).toEqual(mockModels);
		});

		it('should handle empty results', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			const result = await client.modelMethods.getContentModules(true, testGuid);

			// Assert
			expect(result).toEqual([]);
			expect(result).toHaveLength(0);
		});
	});

	describe('getPageModules', () => {
		it('should retrieve page modules with correct parameters', async () => {
			// Arrange
			const mockPageModels = [{ id: 10, displayName: 'Page Model 1', referenceName: 'PageModel1' }];
			mockedAxiosInstance.get.mockResolvedValue({ data: mockPageModels });

			// Act
			const result = await client.modelMethods.getPageModules(true, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'model/list-page-modules/true',
				expect.any(Object)
			);
			expect(result).toEqual(mockPageModels);
		});
	});

	describe('getModelByReferenceName', () => {
		it('should retrieve model by reference name', async () => {
			// Arrange
			const referenceName = 'TestModel';
			const mockModel = {
				id: 789,
				displayName: 'Test Model',
				referenceName,
			};
			mockedAxiosInstance.get.mockResolvedValue({ data: mockModel });

			// Act
			const result = await client.modelMethods.getModelByReferenceName(referenceName, testGuid);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`model/${referenceName}`,
				expect.any(Object)
			);
			expect(result).toEqual(mockModel);
			expect(result.referenceName).toBe(referenceName);
		});

		it('should handle reference name not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Reference name not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.modelMethods.getModelByReferenceName('NonExistent', testGuid)
			).rejects.toThrow('Unable to retrieve model for referenceName: NonExistent.');
		});
	});

	describe('deleteModel', () => {
		it('should delete model successfully', async () => {
			// Arrange
			const modelId = 123;
			mockedAxiosInstance.delete.mockResolvedValue({ data: 'OK' });

			// Act
			const result = await client.modelMethods.deleteModel(modelId, testGuid);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`model/${modelId}`,
				expect.any(Object)
			);
			expect(result).toBe('OK');
		});

		it('should handle delete errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot delete model in use' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.modelMethods.deleteModel(123, testGuid)).rejects.toThrow(
				'Unable to delete the model'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: [] });

			// Act
			await client.modelMethods.getContentModules(true, testGuid);

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
			await client.modelMethods.getContentModules(true, differentGuid);

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
