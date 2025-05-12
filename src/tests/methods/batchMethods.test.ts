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
        // Note: Finding a valid batchID might require setup steps to create a batch first.
        it.skip('should retrieve a specific batch by ID', async () => {
            const batchID = 1; // Replace with a valid, existing batch ID for testing
            
            try {
                const batch = await batchMethods.getBatch(batchID, guid);
                
                expect(batch).toBeDefined();
                expect(batch).toHaveProperty('batchID', batchID);
                expect(batch).toHaveProperty('batchState');
                expect(batch).toHaveProperty('items');
                expect(Array.isArray(batch.items)).toBe(true);
            } catch (error) {
                // If the batch ID doesn't exist, the API might throw an error.
                // Depending on expected behavior, you might adjust the test.
                console.error(`Test failed for batchID ${batchID}:`, error);
                // Rethrow or handle as appropriate for your test case
                throw error; 
            }
        });

        it('should throw an error for a non-existent batch ID', async () => {
            const nonExistentBatchID = -99999; // Use an ID that is guaranteed not to exist
            
            await expect(batchMethods.getBatch(nonExistentBatchID, guid))
                .rejects
                .toThrow(); // Or expect a specific error type/message if applicable
        });
    });
}); 