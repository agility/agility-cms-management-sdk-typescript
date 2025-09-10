import { ApiClient, Options, PageItem } from '../../src';

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

describe('PageMethods - Unit Tests', () => {
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

	describe('getPage', () => {
		const mockPageItem: PageItem = {
			pageID: 123,
			name: 'Test Page',
			path: '/test-page',
			templateID: 1,
			releaseDate: '2025-01-10T10:00:00Z',
			pullDate: null,
			sitemapNode: {
				pageID: 123,
				name: 'Test Page',
				path: '/test-page',
				menuText: 'Test Page',
				visible: {
					menu: true,
					sitemap: true,
				},
			},
		};

		it('should retrieve page by ID successfully', async () => {
			// Arrange
			const pageID = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockPageItem });

			// Act
			const result = await client.pageMethods.getPage(pageID, testGuid, testLocale);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/page/${pageID}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockPageItem);
		});

		it('should handle page not found', async () => {
			// Arrange
			const apiError = {
				response: { status: 404, data: 'Page not found' },
				message: 'Request failed with status code 404',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.pageMethods.getPage(999, testGuid, testLocale)).rejects.toThrow(
				'Unable to retrieve page for id 999.'
			);
		});
	});

	describe('getSitemap', () => {
		const mockSitemap = [
			{
				pageID: 123,
				name: 'Home',
				path: '/',
				menuText: 'Home',
				visible: { menu: true, sitemap: true },
				children: [],
			},
			{
				pageID: 124,
				name: 'About',
				path: '/about',
				menuText: 'About',
				visible: { menu: true, sitemap: true },
				children: [],
			},
		];

		it('should retrieve sitemap successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockSitemap });

			// Act
			const result = await client.pageMethods.getSitemap(testGuid, testLocale);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/sitemap`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockSitemap);
		});

		it('should handle sitemap API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.pageMethods.getSitemap(testGuid, testLocale)).rejects.toThrow(
				'Unable to retrieve sitemap.'
			);
		});
	});

	describe('savePage', () => {
		const mockPageItem: PageItem = {
			pageID: 0, // 0 for new page
			name: 'New Test Page',
			path: '/new-test-page',
			templateID: 1,
			releaseDate: '2025-01-10T10:00:00Z',
			pullDate: null,
			sitemapNode: {
				pageID: 0,
				name: 'New Test Page',
				path: '/new-test-page',
				menuText: 'New Test Page',
				visible: {
					menu: true,
					sitemap: true,
				},
			},
		};

		it('should create a new page successfully with returnBatchId=true', async () => {
			// Arrange
			const batchId = 456;
			mockedAxiosInstance.post.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.pageMethods.savePage(
				mockPageItem,
				testGuid,
				testLocale,
				undefined,
				undefined,
				true
			);

			// Assert
			expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
				`${testLocale}/page?parentPageID=-1&placeBeforePageItemID=-1`,
				mockPageItem,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle save page errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Invalid page data' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.post.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.pageMethods.savePage(mockPageItem, testGuid, testLocale, undefined, undefined, true)
			).rejects.toThrow('Unable to create page.');
		});
	});

	describe('publishPage', () => {
		it('should publish page successfully with returnBatchId=true', async () => {
			// Arrange
			const pageID = 123;
			const batchId = 456;
			const comments = 'Publishing page';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.pageMethods.publishPage(
				pageID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/page/${pageID}/publish?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle publish page errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot publish page' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.pageMethods.publishPage(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to publish the page for id: 123');
		});
	});

	describe('approvePage', () => {
		it('should approve page successfully with returnBatchId=true', async () => {
			// Arrange
			const pageID = 123;
			const batchId = 456;
			const comments = 'Approving page';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.pageMethods.approvePage(
				pageID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/page/${pageID}/approve?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle approve page errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot approve page' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.pageMethods.approvePage(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to approve the page for id: 123');
		});
	});

	describe('declinePage', () => {
		it('should decline page successfully with returnBatchId=true', async () => {
			// Arrange
			const pageID = 123;
			const batchId = 456;
			const comments = 'Declining page';
			mockedAxiosInstance.get.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.pageMethods.declinePage(
				pageID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/page/${pageID}/decline?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle decline page errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot decline page' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.pageMethods.declinePage(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to decline the page for id: 123');
		});
	});

	describe('deletePage', () => {
		it('should delete page successfully with returnBatchId=true', async () => {
			// Arrange
			const pageID = 123;
			const batchId = 456;
			const comments = 'Deleting page';
			mockedAxiosInstance.delete.mockResolvedValue({ data: batchId });

			// Act
			const result = await client.pageMethods.deletePage(
				pageID,
				testGuid,
				testLocale,
				comments,
				true
			);

			// Assert
			expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(
				`${testLocale}/page/${pageID}?comments=${comments}`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual([batchId]);
		});

		it('should handle delete page errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 400, data: 'Cannot delete page' },
				message: 'Request failed with status code 400',
			};
			mockedAxiosInstance.delete.mockRejectedValue(apiError);

			// Act & Assert
			await expect(
				client.pageMethods.deletePage(123, testGuid, testLocale, 'test', true)
			).rejects.toThrow('Unable to delete the page for id: 123');
		});
	});

	describe('getPageTemplates', () => {
		const mockTemplates = [
			{
				templateID: 1,
				name: 'Home Template',
				description: 'Template for home pages',
			},
			{
				templateID: 2,
				name: 'Article Template',
				description: 'Template for articles',
			},
		];

		it('should retrieve page templates successfully', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: mockTemplates });

			// Act
			const result = await client.pageMethods.getPageTemplates(testGuid, testLocale, true);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				expect.stringContaining(`${testLocale}/page/templates`),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
			expect(result).toEqual(mockTemplates);
		});

		it('should handle page templates API errors', async () => {
			// Arrange
			const apiError = {
				response: { status: 500, data: 'Internal server error' },
				message: 'Request failed with status code 500',
			};
			mockedAxiosInstance.get.mockRejectedValue(apiError);

			// Act & Assert
			await expect(client.pageMethods.getPageTemplates(testGuid, testLocale, true)).rejects.toThrow(
				'Unable to retrieve Page Templates.'
			);
		});
	});

	describe('getPageHistory', () => {
		const mockHistory = [
			{
				pageID: 123,
				versionID: 1,
				modified: '2025-01-10T10:00:00Z',
				modifiedBy: 'user1',
			},
			{
				pageID: 123,
				versionID: 2,
				modified: '2025-01-10T11:00:00Z',
				modifiedBy: 'user2',
			},
		];

		it('should retrieve page history successfully', async () => {
			// Arrange
			const pageID = 123;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockHistory });

			// Act
			const result = await client.pageMethods.getPageHistory(testLocale, testGuid, pageID);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${pageID}/history?take=50&skip=0`,
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
			const pageID = 123;
			const take = 25;
			const skip = 10;
			mockedAxiosInstance.get.mockResolvedValue({ data: mockHistory });

			// Act
			await client.pageMethods.getPageHistory(testLocale, testGuid, pageID, take, skip);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${testLocale}/item/${pageID}/history?take=${take}&skip=${skip}`,
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
				await client.pageMethods.getPage(123, testGuid, testLocale);
				fail('Expected method to throw');
			} catch (error: any) {
				expect(error.message).toBe('Unable to retrieve page for id 123.');
				expect(error.innerError).toBeDefined();
				expect(error.innerError.response.status).toBe(403);
			}
		});

		it('should handle network errors', async () => {
			// Arrange
			const networkError = new Error('Network Error');
			mockedAxiosInstance.get.mockRejectedValue(networkError);

			// Act & Assert
			await expect(client.pageMethods.getPage(123, testGuid, testLocale)).rejects.toThrow(
				'Unable to retrieve page for id 123.'
			);
		});
	});

	describe('Client Configuration', () => {
		it('should use correct headers', async () => {
			// Arrange
			mockedAxiosInstance.get.mockResolvedValue({ data: {} });

			// Act
			await client.pageMethods.getPage(123, testGuid, testLocale);

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
			await client.pageMethods.getPage(123, testGuid, differentLocale);

			// Assert
			expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
				`${differentLocale}/page/123`,
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-bearer-token',
					}),
				})
			);
		});
	});
});
