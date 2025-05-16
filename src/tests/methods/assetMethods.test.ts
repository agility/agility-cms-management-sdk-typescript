import { AssetMethods } from '../../apiMethods/assetMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';

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

    describe('upload', () => {
        test.todo('should upload a file to the specified folder path');

    });

    describe('deleteFile', () => {
        test.todo('should delete a file from the specified folder path');

    });

    describe('moveFile', () => {
        test.todo('should move a file to the specified folder path');

    });

    describe('createFolder', () => {
        test.todo('should create a folder in the specified folder path');

    });

    describe('renameFolder', () => {
        test.todo('should rename a folder in the specified folder path');

    });

    describe('deleteFolder', () => {
        test.todo('should delete a folder in the specified folder path');

    });

    describe('getAssetById', () => {
        test.todo('should get an asset by its ID');

    });

    describe('getAssetByUrl', () => {
        test.todo('should get an asset by its URL');
    });

    describe('getGalleryById', () => {
        test.todo('should retrieve a specific gallery by its ID');
    });

    describe('deleteGallery', () => {
        test.todo('should delete a specific gallery by its ID');
    });

    describe('getGalleryByName', () => {
        test.todo('should retrieve a specific gallery by its name');
    });

    describe('saveGallery', () => {
        test.todo('should save (create or update) a gallery');
    });

    describe('getDefaultContainer', () => {
        test.todo('should retrieve the default asset container details');
    });
}); 