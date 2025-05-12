import { AssetMethods } from '../../apiMethods/assetMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ApiClient } from '../../apiClient';

describe('AssetMethods', () => {
    let assetMethods: AssetMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        assetMethods = new AssetMethods(options);
    });

    describe('getMediaList', () => {
        it('should retrieve a list of media assets', async () => {
            const pageSize = 10;
            const recordOffset = 0;
            const mediaList = await assetMethods.getMediaList(pageSize, recordOffset, guid);

            expect(mediaList).toBeDefined();
            expect(mediaList).toHaveProperty('assetMedias');
            expect(mediaList).toHaveProperty('totalCount');
            expect(Array.isArray(mediaList.assetMedias)).toBe(true);
        });
    });

    describe('getGalleries', () => {
        it('should retrieve a list of galleries', async () => {
            const galleries = await assetMethods.getGalleries(guid);

            expect(galleries).toBeDefined();
            expect(galleries).toHaveProperty('assetMediaGroupings');
            expect(galleries).toHaveProperty('totalCount');
            expect(Array.isArray(galleries.assetMediaGroupings)).toBe(true);
        });

        it('should retrieve galleries with search filter', async () => {
            const search = 'test'; // Replace with a relevant search term if needed
            const galleries = await assetMethods.getGalleries(guid, search);

            expect(galleries).toBeDefined();
            expect(galleries).toHaveProperty('assetMediaGroupings');
            expect(galleries).toHaveProperty('totalCount');
            expect(Array.isArray(galleries.assetMediaGroupings)).toBe(true);
        });
    });
}); 