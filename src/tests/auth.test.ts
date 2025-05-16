import { ApiClientConfig } from './config/apiClient.config';
import { TestConfiguration } from './config/test.config';
import { TableClient } from '@azure/data-tables';
import axios from 'axios';

// Ensure environment variables are loaded (dotenv should be configured in test.config or jest setup)

describe('Authentication Flow Tests', () => {
    let apiClientConfig: ApiClientConfig;
    let testConfig: TestConfiguration;
    const partitionKey = 'Integration-Test'; // As defined in apiClient.config
    let rowKey: string; // Will be set based on TEST_ENV

    beforeAll(() => {
        // Ensure TEST_ENV is set for the test environment (e.g., via package.json script)
        if (!process.env.TEST_ENV) {
            console.warn('TEST_ENV is not set, defaulting to "dev" for auth tests.');
            process.env.TEST_ENV = 'dev'; // Default for safety, but should be set externally
        }
        // Correctly compare against uppercase DEV
        rowKey = process.env.TEST_ENV === "DEV" ? "dev" : "prod";

        testConfig = TestConfiguration.getInstance();
        apiClientConfig = ApiClientConfig.getInstance();
    });

    it('should load required environment variables', () => {
        const azureConfig = testConfig.getAzureConfig();
        const envConfig = testConfig.getConfig();

        // Check Azure config (loaded directly from process.env)
        expect(azureConfig.storageAccount).toBeTruthy();
        expect(azureConfig.storageAccountKey).toBeTruthy();
        expect(azureConfig.storageAccountTable).toBeTruthy();
        
        // Check environment-specific config
        expect(envConfig.guid).toBeTruthy();
        expect(envConfig.managementApiBaseUrl).toBeTruthy();
    });

    // Test connecting to Azure Table and fetching the raw token entry
    it('should connect to Azure Table Storage and fetch the current token data', async () => {
        let currentTokenData: any;
        try {
            // Accessing private methods for testing is generally discouraged,
            // but necessary here to isolate the step. Consider refactoring 
            // apiClientConfig for better testability if this becomes complex.
            // @ts-ignore Accessing private method for test isolation
            const tableClient: TableClient = await apiClientConfig.getTableClient();
            expect(tableClient).toBeDefined();
            
            // @ts-ignore Accessing private method for test isolation
            currentTokenData = await apiClientConfig.getCurrentToken(partitionKey, rowKey);

            expect(currentTokenData).toBeDefined();
            expect(currentTokenData).not.toBeNull();
             // Check specifically for the refresh token field needed later
            expect(currentTokenData.refresh_token).toBeDefined();
            expect(currentTokenData.refresh_token).not.toBeNull();
            expect(typeof currentTokenData.refresh_token).toBe('string');
            expect(currentTokenData.refresh_token.length).toBeGreaterThan(10); // Basic sanity check

        } catch (error) {
            console.error("Error fetching token data from Azure:", error);
            throw error; // Fail the test if fetching fails
        }
    });

    // Test the authorization token refresh mechanism directly
    it('should successfully refresh the authorization token', async () => {
        let refreshedTokenInfo: any;
        try {
             // @ts-ignore Accessing private method for test isolation
            refreshedTokenInfo = await apiClientConfig.getAuthorizationToken();
            
            expect(refreshedTokenInfo).toBeDefined();
            expect(refreshedTokenInfo.access_token).toBeTruthy();
            expect(refreshedTokenInfo.refresh_token).toBeTruthy(); // Should get a new refresh token too

        } catch (error) {
            console.error("Error refreshing authorization token:", error);
            // Log the detailed error message we added previously
            throw error; // Fail the test if refreshing fails
        }
    }, 30000); // Increase timeout for network requests

    // Test the final client creation
    it('should create the Management SDK client instance successfully', async () => {
        try {
            const { apiClient, guid } = await apiClientConfig.createManagementSdkClient();
            
            expect(apiClient).toBeDefined();
            expect(guid).toBeTruthy();
            expect(apiClient._options.token).toBeTruthy(); // Check if the access token is set
             // Optionally check if the refresh token is also passed
            expect(apiClient._options.refresh_token).toBeTruthy(); 

        } catch (error) {
            console.error("Error creating Management SDK client:", error);
            throw error; // Fail the test if client creation fails
        }
    }, 30000); // Increase timeout

}); 