import { ContentMethods } from '../../apiMethods/contentMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ApiClient } from '../../apiClient';
import { ContentItem, ContentList } from '../../types/contentItem';
import { ListParams } from '../../types/listParams';

describe('ContentMethods', () => {
    let contentMethods: ContentMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let testContentItem: ContentItem | null = null; // Used to store a content item for testing
    const locale = 'en-us'; // Default locale for tests
    let testReferenceName: string | null = null; // A known reference name for list tests

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        contentMethods = new ContentMethods(options);

        // Attempt to fetch an existing content list and item for testing
        // Replace 'posts' with a valid reference name from your Agility instance
        testReferenceName = 'posts'; 
        try {
            const listParams: ListParams = { take: 1 };
            const contentList = await contentMethods.getContentList(testReferenceName, guid, locale, listParams);
            if (contentList && contentList.items && contentList.items.length > 0) {
                testContentItem = contentList.items[0];
            } else {
                console.warn(`Could not find any content items for reference name '${testReferenceName}' in beforeAll.`);
            }
        } catch (error) {
            console.error(`Failed to fetch initial content item for reference name '${testReferenceName}' in beforeAll:`, error);
        }
    });

    describe('getContentList', () => {
        it('should retrieve a list of content items for a given reference name', async () => {
            if (!testReferenceName) {
                console.warn("Skipping getContentList test: No test reference name set.");
                return;
            }
            const listParams: ListParams = {};
            const contentList = await contentMethods.getContentList(testReferenceName, guid, locale, listParams);
            
            expect(contentList).toBeDefined();
            expect(contentList).toHaveProperty('items');
            expect(contentList).toHaveProperty('totalCount');
            // Ensure items is an array before checking its contents
            expect(Array.isArray(contentList.items)).toBe(true);
            if (contentList.items && contentList.items.length > 0) {
                expect(contentList.items[0]).toHaveProperty('contentID');
                expect(contentList.items[0]).toHaveProperty('properties');
                expect(contentList.items[0]).toHaveProperty('fields');
            }
        });

        it('should throw an error for a non-existent reference name', async () => {
            const nonExistentRefName = 'non_existent_ref_name';
            const listParams: ListParams = {};

            await expect(contentMethods.getContentList(nonExistentRefName, guid, locale, listParams))
                .rejects
                .toThrow();
        });
    });

    describe('getContentItem', () => {
        it('should retrieve a specific content item by ID', async () => {
            if (!testContentItem || !testContentItem.contentID) {
                console.warn("Skipping getContentItem test: No test content item found.");
                return;
            }

            const contentID = testContentItem.contentID;
            const item = await contentMethods.getContentItem(contentID, guid, locale);

            expect(item).toBeDefined();
            expect(item).toHaveProperty('contentID', contentID);
            expect(item).toHaveProperty('properties');
            expect(item).toHaveProperty('fields');
            // Compare fields if possible, ensuring deep equality might require a helper or library
            // expect(item.fields).toEqual(testContentItem.fields);
        });

        it('should throw an error for a non-existent content ID', async () => {
            const nonExistentID = -99999;
            await expect(contentMethods.getContentItem(nonExistentID, guid, locale))
                .rejects
                .toThrow();
        });
    });

    describe('publishContent', () => {
        it('should publish a content item', async () => {
            const listParams: ListParams = { take: 1 };
            const contentList = await contentMethods.getContentList('posts', guid, 'en-us', listParams);
            
            if (!contentList || !contentList.items || contentList.items.length === 0) {
                console.warn("Skipping publishContent test: No content items found in 'posts' list.");
                return;
            }

            const contentID = contentList.items[0].contentID;
            await contentMethods.publishContent(contentID, guid, 'comments');
            // Add assertions here if needed, e.g., check item status after publish
        });
    });

    // Add describe blocks and tests for other methods like:
    // saveContentItem, publishContent, unPublishContent, deleteContent, etc.
    // These will likely require creating/modifying content items in setup/teardown steps.
}); 