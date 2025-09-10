import { ApiClient, ContentItem, ContentList, Options } from '../../src';

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

describe('ContentMethods - Unit Tests', () => {
	let client: ApiClient;
	const testGuid = 'test-guid-123';
	const testLocale = 'en-us';

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

	describe('getContentItem', () => {
		const mockContentItem: ContentItem = {
			contentID: 123,
			properties: {
				state: 2,
				modified: '2025-01-10T10:00:00Z',
				versionID: 1,
			},
			fields: {
				title: 'Test Content',
				textBlob: 'This is test content',
			},
		};

		it('should retrieve content item by ID successfully', async () => {
			// Arrange
			const contentID = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockContentItem });

			// Act
			const result = await client.contentMethods.getContentItem(contentID, testGuid, testLocale);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockContentItem);
		});

		it('should handle content item not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Content not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.contentMethods.getContentItem(999, testGuid, testLocale)).rejects.toThrow(
				'Unable to retrieve the content for id: 999'
			);
		});
	});

	describe('getContentList', () => {
		const mockContentList: ContentList = {
			items: [
				{
					contentID: 123,
					properties: {
						state: 2,
						modified: '2025-01-10T10:00:00Z',
						versionID: 1,
					},
					fields: {
						title: 'Test Content 1',
					},
				},
				{
					contentID: 124,
					properties: {
						state: 2,
						modified: '2025-01-10T10:30:00Z',
						versionID: 1,
					},
					fields: {
						title: 'Test Content 2',
					},
				},
			],
			totalCount: 2,
		};

		it('should retrieve content list with default parameters', async () => {
			// Arrange
			const referenceName = 'TestContent';
			mockedAxiosInstance.post.mockResolvedValue({ data: mockContentList });

			// Act
			const result = await client.contentMethods.getContentList(
				referenceName,
				testGuid,
				testLocale,
				{ take: 50, skip: 0 }
			);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				expect.stringContaining(`${testLocale}/list/${referenceName}`),
				undefined,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockContentList);
		});

		it('should handle empty results', async () => {
			// Arrange
			const emptyList: ContentList = { items: [], totalCount: 0 };
			mockedAxiosInstance.post.mockResolvedValue({ data: emptyList });

			// Act
			const result = await client.contentMethods.getContentList(
				'NonExistent',
				testGuid,
				testLocale,
				{ take: 50, skip: 0 }
			);

			// Assert
			expect(result).toEqual(emptyList);
			expect(result.items).toHaveLength(0);
		});

		it('should handle API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.getContentList('TestContent', testGuid, testLocale, {
					take: 50,
					skip: 0,
				})
			).rejects.toThrow(
				'Unable retrieve the content details for list with reference name: TestContent'
			);
		});
	});

	describe('saveContentItem', () => {
		const mockContentItem: ContentItem = {
			contentID: 0, // 0 for new content
			properties: {
				state: 2,
				modified: '2025-01-10T10:00:00Z',
				versionID: 1,
			},
			fields: {
				title: 'New Test Content',
				textBlob: 'This is new test content',
			},
		};

		it('should create a new content item successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.saveContentItem(
				mockContentItem,
				testGuid,
				testLocale,
				true
			);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`${testLocale}/item`,
				mockContentItem,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle save content item errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid content data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.saveContentItem(mockContentItem, testGuid, testLocale, true)
			).rejects.toThrow('Unable to create content.');
		});
	});

	describe('publishContent', () => {
		it('should publish content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Publishing content';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.publishContent(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/publish?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle publish content errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot publish content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.publishContent(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to publish the content for id: 123');
		});
	});

	describe('unPublishContent', () => {
		it('should unpublish content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Unpublishing content';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.unPublishContent(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/unpublish?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle unpublish content errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot unpublish content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.unPublishContent(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to un-publish the content for id: 123');
		});
	});

	describe('approveContent', () => {
		it('should approve content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Approving content';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.approveContent(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/approve?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle approve content errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot approve content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.approveContent(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to approve the content for id: 123');
		});
	});

	describe('declineContent', () => {
		it('should decline content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Declining content';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.declineContent(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/decline?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle decline content errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot decline content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.declineContent(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to decline the content for id: 123');
		});
	});

	describe('deleteContent', () => {
		it('should delete content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Deleting content';
			mockedAxiosInstance.delete.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.deleteContent(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle delete content errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot delete content' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.deleteContent(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to delete the content for id: 123');
		});
	});

	describe('contentRequestApproval', () => {
		it('should request approval for content successfully with returnBatchId=true', async () => {
			// Arrange
			const contentID = 123;
			const batchId = 456;
			const comments = 'Requesting approval';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.contentMethods.contentRequestApproval(
				contentID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/request-approval?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle request approval errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot request approval' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.contentMethods.contentRequestApproval(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to request approval the content for id: 123');
		});
	});

	describe('getContentHistory', () => {
		const mockHistory = [
			{
				contentID: 123,
				versionID: 1,
				modified: '2025-01-10T10:00:00Z',
				modifiedBy: 'user1',
			},
			{
				contentID: 123,
				versionID: 2,
				modified: '2025-01-10T11:00:00Z',
				modifiedBy: 'user2',
			},
		];

		it('should retrieve content history successfully', async () => {
			// Arrange
			const contentID = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockHistory });

			// Act
			const result = await client.contentMethods.getContentHistory(testLocale, testGuid, contentID);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/history?take=50&skip=0`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockHistory);
		});

		it('should handle pagination parameters', async () => {
			// Arrange
			const contentID = 123;
			const take = 25;
			const skip = 10;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockHistory });

			// Act
			await client.contentMethods.getContentHistory(testLocale, testGuid, contentID, take, skip);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${contentID}/history?take=${take}&skip=${skip}`,
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
				await client.contentMethods.getContentItem(123, testGuid, testLocale);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve the content for id: 123');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.contentMethods.getContentItem(123, testGuid, testLocale)).rejects.toThrow(
				'Unable to retrieve the content for id: 123'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.contentMethods.getContentItem(123, testGuid, testLocale);

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

		it('should handle different locales', async () => {
			// Arrange
			const differentLocale = 'fr-ca';
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.contentMethods.getContentItem(123, testGuid, differentLocale);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${differentLocale}/item/123`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
