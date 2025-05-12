import { WebhookMethods } from '../../apiMethods/webhookMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { Webhook } from '../../types/webhook'; // Updated path
import { ApiClient } from '../../apiClient';

describe('WebhookMethods', () => {
    let webhookMethods: WebhookMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let createdWebhookID: string | null = null; // Store ID of webhook created for testing

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        
        // Corrected typo from _cleintInstance to _clientInstance if it exists in the actual class
        // Assuming the constructor initializes _clientInstance correctly.
        webhookMethods = new WebhookMethods(options);
    });

    afterAll(async () => {
        // Cleanup: Delete any webhook created during the tests if it still exists
        if (createdWebhookID) {
            try {
                await webhookMethods.deleteWebhook(guid, createdWebhookID);
                console.log(`Cleaned up test webhook ID: ${createdWebhookID}`);
            } catch (error) {
                // Log error if cleanup failed, but don't fail the test suite
                console.error(`Failed to cleanup test webhook ID ${createdWebhookID}:`, error);
            }
        }
    });

    describe('webhookList', () => {
        it('should retrieve a list of webhooks', async () => {
            const webhooks = await webhookMethods.webhookList(guid);
            
            // The API returns the raw data, structure might vary.
            // Adjust expectations based on actual API response.
            expect(webhooks).toBeDefined();
            expect(Array.isArray(webhooks)).toBe(true);

            // If the list isn't empty, check the structure of the first item
            if (webhooks.length > 0) {
                // Assuming webhook objects have these properties based on typical webhook structures
                expect(webhooks[0]).toHaveProperty('id'); // Or 'webhookID', check actual response
                expect(webhooks[0]).toHaveProperty('url');
                expect(webhooks[0]).toHaveProperty('name');
            }
        });
    });

    describe('saveWebhook, getWebhook, and deleteWebhook', () => {
        const testWebhook: Webhook = {
            name: `Test Webhook ${Date.now()}`,
            url: 'https://example.com/test-webhook-endpoint',
            instanceGuid: guid, // Ensure this is set correctly if needed by API
            enabled: true,
            contentWorkflowEvents: true,
            contentPublishEvents: false,
            contentSaveEvents: false
        };

        it('should save a new webhook, get it, and then delete it', async () => {
            // 1. Save Webhook
            // The save method might return the created webhook object or just an ID/status.
            // Adjust expectations based on the actual return value.
            const saveResponse = await webhookMethods.saveWebhook(guid, testWebhook);
            expect(saveResponse).toBeDefined();
            
            // Assuming the response contains the ID of the created webhook
            // Adjust property name ('id', 'webhookID', etc.) based on actual response
            createdWebhookID = saveResponse.id; 
            expect(createdWebhookID).toBeDefined();
            expect(typeof createdWebhookID).toBe('string'); // Assuming ID is a string (like a UUID)
            
            if (!createdWebhookID) {
                throw new Error('Webhook creation did not return an ID.');
            }

            // 2. Get Webhook
            const fetchedWebhook = await webhookMethods.getWebhook(guid, createdWebhookID);
            expect(fetchedWebhook).toBeDefined();
            expect(fetchedWebhook.id).toBe(createdWebhookID);
            expect(fetchedWebhook.name).toBe(testWebhook.name);
            expect(fetchedWebhook.url).toBe(testWebhook.url);
            expect(fetchedWebhook.enabled).toBe(testWebhook.enabled);

            // 3. Delete Webhook
            await webhookMethods.deleteWebhook(guid, createdWebhookID);

            // 4. Verify Deletion (Attempt to Get Again)
            await expect(webhookMethods.getWebhook(guid, createdWebhookID))
                .rejects
                .toThrow(); // Expect an error when trying to get the deleted webhook

            // Mark as deleted for cleanup check
            createdWebhookID = null; 
        });

        it('should fail to get a non-existent webhook', async () => {
            const nonExistentID = '00000000-0000-0000-0000-000000000000'; // Example non-existent UUID
            await expect(webhookMethods.getWebhook(guid, nonExistentID))
                .rejects
                .toThrow();
        });

        it('should fail to delete a non-existent webhook', async () => {
            const nonExistentID = '00000000-0000-0000-0000-000000000000';
            // Delete might not throw an error for non-existent, depending on API design.
            // It might just do nothing. Adjust expectation if necessary.
            await expect(webhookMethods.deleteWebhook(guid, nonExistentID))
                .rejects
                .toThrow(); // Or resolve without error if that's the behavior
        });
    });
}); 