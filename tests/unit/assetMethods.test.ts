import { ApiClient, Options, assetGalleries, assetMediaGrouping } from '../../src';

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

describe('AssetMethods - Unit Tests', () => {
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

	describe('Gallery Operations', () => {
		const mockGallery: assetMediaGrouping = {
			mediaGroupingID: 123,
			name: 'Test Gallery',
			description: 'Test gallery description',
			groupingType: null,
			groupingTypeID: 1,
			modifiedBy: null,
			modifiedByName: null,
			modifiedOn: null,
			isDeleted: false,
			isFolder: false,
			metaData: {},
		};

		describe('saveGallery', () => {
			it('should create a new gallery successfully', async () => {
				// Arrange
				const newGallery = { ...mockGallery, mediaGroupingID: 0 };
				const mockResponse = {
					data: {
						...mockGallery,
						mediaGroupingID: 123,
						modifiedOn: '2025-01-10T10:00:00Z',
					},
				};

				mockedAxiosInstance.post.mockResolvedValue(mockResponse);

				// Act
				const result = await client.assetMethods.saveGallery(testGuid, newGallery);

				// Assert - Verify API call
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					'/asset/gallery',
					newGallery,
					expect.objectContaining({
						headers: expect.objectContaining({
							Authorization: 'Bearer test-bearer-token',
						}),
					})
				);

				// Assert - Verify result
				expect(result).toEqual(mockResponse.data);
				expect(result.mediaGroupingID).toBe(123);
				expect(result.name).toBe('Test Gallery');
			});

			it('should update an existing gallery', async () => {
				// Arrange
				const existingGallery = { ...mockGallery, description: 'Updated description' };
				const mockResponse = { data: existingGallery };

				mockedAxiosInstance.post.mockResolvedValue(mockResponse);

				// Act
				const result = await client.assetMethods.saveGallery(testGuid, existingGallery);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					'/asset/gallery',
					existingGallery,
					expect.any(Object)
				);
				expect(result.description).toBe('Updated description');
			});

			it('should handle save gallery errors', async () => {
				// Arrange
				const apiError = {
					response: { status: 400, data: 'Invalid gallery data' },
					message: 'Request failed with status code 400',
				};
				mockedAxiosInstance.post.mockRejectedValue(apiError);

				// Act & Assert
				await expect(client.assetMethods.saveGallery(testGuid, mockGallery)).rejects.toThrow(
					'Unable to save gallery'
				);
			});
		});

		describe('getGalleries', () => {
			const mockGalleryList: assetGalleries = {
				assetMediaGroupings: [mockGallery],
				totalCount: 1,
			};

			it('should retrieve all galleries with default parameters', async () => {
				// Arrange
				mockedAxiosInstance.get.mockResolvedValue({ data: mockGalleryList });

				// Act
				const result = await client.assetMethods.getGalleries(testGuid, '', 50, 0);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					'asset/galleries?search=&pageSize=50&rowIndex=0',
					expect.any(Object)
				);
				expect(result).toEqual(mockGalleryList);
				expect(result.assetMediaGroupings).toHaveLength(1);
			});

			it('should handle search parameters correctly', async () => {
				// Arrange
				mockedAxiosInstance.get.mockResolvedValue({ data: mockGalleryList });

				// Act
				await client.assetMethods.getGalleries(testGuid, 'search-term', 25, 10);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					'asset/galleries?search=search-term&pageSize=25&rowIndex=10',
					expect.any(Object)
				);
			});

			it('should handle empty results', async () => {
				// Arrange
				const emptyResult: assetGalleries = {
					assetMediaGroupings: [],
					totalCount: 0,
				};
				mockedAxiosInstance.get.mockResolvedValue({ data: emptyResult });

				// Act
				const result = await client.assetMethods.getGalleries(testGuid, 'nonexistent', 50, 0);

				// Assert
				expect(result.assetMediaGroupings).toHaveLength(0);
				expect(result.totalCount).toBe(0);
			});

			it('should handle API errors', async () => {
				// Arrange
				const apiError = {
					response: { status: 500, data: 'Server error' },
					message: 'Request failed with status code 500',
				};
				mockedAxiosInstance.get.mockRejectedValue(apiError);

				// Act & Assert
				await expect(client.assetMethods.getGalleries(testGuid)).rejects.toThrow(
					'Unable to retrieve galleries for the website.'
				);
			});
		});

		describe('getGalleryById', () => {
			it('should retrieve gallery by ID successfully', async () => {
				// Arrange
				const galleryId = 123;
				mockedAxiosInstance.get.mockResolvedValue({ data: mockGallery });

				// Act
				const result = await client.assetMethods.getGalleryById(testGuid, galleryId);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					`/asset/gallery/${galleryId}`,
					expect.any(Object)
				);
				expect(result).toEqual(mockGallery);
				expect(result.mediaGroupingID).toBe(123);
			});

			it('should handle gallery not found', async () => {
				// Arrange
				const apiError = {
					response: { status: 404, data: 'Gallery not found' },
					message: 'Request failed with status code 404',
				};
				mockedAxiosInstance.get.mockRejectedValue(apiError);

				// Act & Assert
				await expect(client.assetMethods.getGalleryById(testGuid, 999)).rejects.toThrow(
					'Unable to retrieve gallery for id 999'
				);
			});
		});

		describe('getGalleryByName', () => {
			it('should retrieve gallery by name successfully', async () => {
				// Arrange
				const galleryName = 'Test Gallery';
				mockedAxiosInstance.get.mockResolvedValue({ data: mockGallery });

				// Act
				const result = await client.assetMethods.getGalleryByName(testGuid, galleryName);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					`/asset/gallery?galleryName=${galleryName}`,
					expect.any(Object)
				);
				expect(result).toEqual(mockGallery);
			});
		});

		describe('deleteGallery', () => {
			it('should delete gallery successfully', async () => {
				// Arrange
				const galleryId = 123;
				mockedAxiosInstance.delete.mockResolvedValue({ data: 'OK' });

				// Act
				const result = await client.assetMethods.deleteGallery(testGuid, galleryId);

				// Assert
				expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
					`/asset/gallery/${galleryId}`,
					expect.any(Object)
				);
				expect(result).toBe('OK');
			});
		});
	});

	describe('Asset Operations', () => {
		describe('getMediaList', () => {
			const mockMediaList = {
				items: [
					{ id: 1, fileName: 'image1.jpg', url: 'https://example.com/image1.jpg' },
					{ id: 2, fileName: 'image2.png', url: 'https://example.com/image2.png' },
				],
				totalCount: 2,
			};

			it('should retrieve media list with default parameters', async () => {
				// Arrange
				mockedAxiosInstance.get.mockResolvedValue({ data: mockMediaList });

				// Act
				const result = await client.assetMethods.getMediaList(50, 0, testGuid);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					'asset/list?pageSize=50&recordOffset=0',
					expect.any(Object)
				);
				expect(result).toEqual(mockMediaList);
				expect(result.items).toHaveLength(2);
			});

			it('should handle pagination parameters', async () => {
				// Arrange
				mockedAxiosInstance.get.mockResolvedValue({ data: mockMediaList });

				// Act
				await client.assetMethods.getMediaList(25, 10, testGuid);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					'asset/list?pageSize=25&recordOffset=10',
					expect.any(Object)
				);
			});
		});

		describe('getAssetByID', () => {
			it('should retrieve asset by ID', async () => {
				// Arrange
				const assetId = 456;
				const mockAsset = {
					id: assetId,
					fileName: 'test-asset.jpg',
					url: 'https://example.com/test-asset.jpg',
				};
				mockedAxiosInstance.get.mockResolvedValue({ data: mockAsset });

				// Act
				const result = await client.assetMethods.getAssetByID(assetId, testGuid);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					`asset/${assetId}`,
					expect.any(Object)
				);
				expect(result).toEqual(mockAsset);
			});
		});

		describe('getAssetByUrl', () => {
			it('should retrieve asset by URL', async () => {
				// Arrange
				const assetUrl = 'https://example.com/test.jpg';
				const mockAsset = { id: 789, fileName: 'test.jpg', url: assetUrl };
				mockedAxiosInstance.get.mockResolvedValue({ data: mockAsset });

				// Act
				const result = await client.assetMethods.getAssetByUrl(assetUrl, testGuid);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					`asset?url=${assetUrl}`,
					expect.any(Object)
				);
				expect(result).toEqual(mockAsset);
			});
		});
	});

	describe('Folder Operations', () => {
		describe('createFolder', () => {
			it('should create folder successfully', async () => {
				// Arrange
				const folderPath = '/new-folder';
				mockedAxiosInstance.post.mockResolvedValue({ data: 'Folder created' });

				// Act
				const result = await client.assetMethods.createFolder(folderPath, testGuid);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					`asset/folder?originKey=${folderPath}`,
					null,
					expect.any(Object)
				);
				expect(result).toBe('Folder created');
			});

			it('should handle folder creation errors', async () => {
				// Arrange
				const apiError = {
					response: { status: 400, data: 'Folder already exists' },
					message: 'Request failed with status code 400',
				};
				mockedAxiosInstance.post.mockRejectedValue(apiError);

				// Act & Assert
				await expect(
					client.assetMethods.createFolder('/existing-folder', testGuid)
				).rejects.toThrow('Unable to create folder.');
			});
		});

		describe('renameFolder', () => {
			it('should rename folder successfully', async () => {
				// Arrange
				const oldPath = '/old-folder';
				const newName = 'new-folder';
				mockedAxiosInstance.post.mockResolvedValue({ data: undefined });

				// Act
				await client.assetMethods.renameFolder(oldPath, newName, testGuid);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					`asset/folder/rename?folderName=${oldPath}&newFolderName=${newName}&mediaID=0`,
					null,
					expect.any(Object)
				);
			});
		});

		describe('deleteFolder', () => {
			it('should delete folder successfully', async () => {
				// Arrange
				const folderPath = '/folder-to-delete';
				mockedAxiosInstance.post.mockResolvedValue({ data: undefined });

				// Act
				await client.assetMethods.deleteFolder(folderPath, testGuid);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					`asset/folder/delete?originKey=${folderPath}&mediaID=0`,
					null,
					expect.any(Object)
				);
			});
		});
	});

	describe('File Operations', () => {
		describe('moveFile', () => {
			it('should move file successfully', async () => {
				// Arrange
				const assetId = 123;
				const newPath = '/new-location/';
				mockedAxiosInstance.post.mockResolvedValue({
					data: { id: assetId, fileName: 'moved-file.jpg' },
				});

				// Act
				const result = await client.assetMethods.moveFile(assetId, newPath, testGuid);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					`asset/move/${assetId}?newFolder=${encodeURIComponent(newPath)}`,
					null,
					expect.any(Object)
				);
				expect(result.id).toBe(assetId);
			});
		});

		describe('upload', () => {
			it('should upload file successfully', async () => {
				// Arrange
				const mockFile = Buffer.from('test file content');
				const fileName = 'test-file.txt';
				const path = '/uploads/';
				const mockUploadResult = {
					id: 999,
					fileName,
					url: 'https://example.com/test-file.txt',
				};

				mockedAxiosInstance.post.mockResolvedValue({ data: mockUploadResult });

				// Act
				const result = await client.assetMethods.upload(mockFile, path, testGuid);

				// Assert
				expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
					`asset/upload?folderPath=${path}&groupingID=-1`,
					mockFile,
					expect.any(Object)
				);
				expect(result).toEqual(mockUploadResult);
			});
		});
	});

	describe('Container Operations', () => {
		describe('getDefaultContainer', () => {
			it('should retrieve default container', async () => {
				// Arrange
				const mockContainer = {
					id: 1,
					name: 'Default Container',
					isDefault: true,
				};
				mockedAxiosInstance.get.mockResolvedValue({ data: mockContainer });

				// Act
				const result = await client.assetMethods.getDefaultContainer(testGuid);

				// Assert
				expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
					'/asset/container',
					expect.any(Object)
				);
				expect(result).toEqual(mockContainer);
			});
		});
	});

	describe('Parameter Validation', () => {
		it('should handle undefined search parameters correctly', async () => {
			// Arrange
			const mockGalleryList: assetGalleries = {
				assetMediaGroupings: [],
				totalCount: 0,
			};
			mockedAxiosInstance.get.mockResolvedValue({ data: mockGalleryList });

			// Act
			await client.assetMethods.getGalleries(testGuid, '', 50, 0);

			// Assert - Ensure no undefined values in URL
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'asset/galleries?search=&pageSize=50&rowIndex=0',
				expect.any(Object)
			);

			// Verify the URL doesn't contain "undefined"
			const calledUrl = mockedAxiosInstance.get.mock.calls[0][0];
			expect(calledUrl).not.toContain('undefined');
		});

		it('should encode URL parameters properly', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({
				data: { assetMediaGroupings: [], totalCount: 0 },
			});

			// Act
			await client.assetMethods.getGalleries(testGuid, 'search with spaces', 50, 0);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				'asset/galleries?search=search with spaces&pageSize=50&rowIndex=0',
				expect.any(Object)
			);
		});
	});
});
