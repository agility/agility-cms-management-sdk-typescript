import { BatchMethods } from '../../apiMethods/batchMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { Batch } from '../../types/batch';
import { ApiClient } from '../../apiClient';

describe('BatchMethods', () => {
    let batchMethods: BatchMethods;
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
        
        batchMethods = new BatchMethods(options);
    });

    describe('getBatch', () => {
        
        it('should throw an error for a non-existent batch ID', async () => {
            const nonExistentBatchID = -99999; // Use an ID that is guaranteed not to exist
            
            // disable for console errors output
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(batchMethods.getBatch(nonExistentBatchID, guid))
                .rejects
                .toThrow(); // Or expect a specific error type/message if applicable
            
            // Restore the original console.error implementation
            consoleErrorSpy.mockRestore();
        });

        // there's a ton of implicity to other tests like content, pages, etc.
        // so we'll revisit these tests cases once we have more tests in other methods
        test.todo('should retrieve a specific batch by ID');
    });
}); 