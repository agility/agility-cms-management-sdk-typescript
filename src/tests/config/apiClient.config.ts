import { TestConfiguration } from './test.config';
import { Options } from '../../types/options';
import { ClientInstance } from '../../apiMethods/clientInstance';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

export class ApiClientConfig {
    private static instance: ApiClientConfig;
    private testConfig: TestConfiguration;
    private _mgmtApiClient: ClientInstance | null = null;
    private tableClient: TableClient | null = null;

    private constructor() {
        this.testConfig = TestConfiguration.getInstance();
    }

    public static getInstance(): ApiClientConfig {
        if (!ApiClientConfig.instance) {
            ApiClientConfig.instance = new ApiClientConfig();
        }
        return ApiClientConfig.instance;
    }

    private async getTableClient(): Promise<TableClient> {
        if (!this.tableClient) {
            const azureConfig = this.testConfig.getAzureConfig();
            const credentials = new AzureNamedKeyCredential(
                azureConfig.storageAccount,
                azureConfig.storageAccountKey
            );
            this.tableClient = new TableClient(
                `https://${azureConfig.storageAccount}.table.core.windows.net`,
                azureConfig.storageAccountTable,
                credentials
            );
        }
        return this.tableClient;
    }

    private async getCurrentToken(partitionKey: string, rowKey: string): Promise<any> {
        try {
            const tableClient = await this.getTableClient();
            const tokenInfo = await tableClient.getEntity(partitionKey, rowKey);
            return tokenInfo;
        } catch (err) {
            return null;
        }
    }

    private async getAuthorizationToken(): Promise<any> {
        const rowKey = process.env.TEST_ENV === "DEV" ? "dev" : "prod";
        const partitionKey = 'Integration-Test';
        const currentToken = await this.getCurrentToken(partitionKey, rowKey);
        
        if (!currentToken) {
            throw new Error('No current token found in Azure Table Storage');
        }

        if (!currentToken.refresh_token || typeof currentToken.refresh_token !== 'string' || currentToken.refresh_token.trim() === '') {
            throw new Error('Refresh token is missing, not a string, or empty from the stored token data.');
        }

        const params = new URLSearchParams();
        params.append("refresh_token", currentToken.refresh_token);

        const config = this.testConfig.getConfig();
        const apiPath = `${config.managementApiBaseUrl}/oauth/refresh?${params.toString()}`;

        const requestHeaders = {
            'Cache-Control': 'no-cache'
        };

        let tokenInfo: any;

        try {
            const resp = await fetch(apiPath, {
                method: 'POST',
                headers: requestHeaders,
                body: null // Body is null as params are in URL
            });

            if (!resp.ok) {
                let errorDataText = 'Unknown error';
                try {
                    errorDataText = await resp.text();
                } catch (parseError) {
                    // Ignore if parsing fails
                }
                throw new Error(`HTTP error during token refresh! Status: ${resp.status}. Response: ${errorDataText}`);
            }

            tokenInfo = await resp.json();

        } catch (err) {
            let errorMessage = 'Failed to refresh token.';
            if (err instanceof Error) {
                errorMessage = `Failed to refresh token: ${err.message}`;
                console.error("Error during token refresh fetch:", err.message);
            } else {
                console.error("Unknown error during token refresh fetch:", err);
            }
            throw new Error(errorMessage);
        }

        tokenInfo.partitionKey = partitionKey;
        tokenInfo.rowKey = rowKey;
        const tableClient = await this.getTableClient();
        await tableClient.upsertEntity(tokenInfo, 'Merge'); 

        return tokenInfo;
    }

    public async createManagementSdkClient(retryAttempts = 1): Promise<{ apiClient: ClientInstance; guid: string }> {
        if (this._mgmtApiClient) {
            // If already initialized, return it
            return {
                apiClient: this._mgmtApiClient,
                guid: this.testConfig.getConfig().guid
            };
        }

        const config = this.testConfig.getConfig();
        let authToken: any; // Ensure authToken is declared to be accessible after the loop
        let attempts = 0;
        const maxAttempts = retryAttempts + 1;

        while (attempts < maxAttempts) {
            try {
                authToken = await this.getAuthorizationToken();
                break; // Success, exit loop
            } catch (error: any) {
                attempts++;
                console.error(`Failed to get authorization token on attempt ${attempts} of ${maxAttempts}. Error: ${error.message}`);
                if (attempts >= maxAttempts) {
                    console.error("All token acquisition attempts failed.");
                    throw error; // Rethrow the last error
                }
                // Optional: add a delay before retrying
                const delayMilliseconds = 1000; // 1 second delay
                console.log(`Waiting ${delayMilliseconds}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, delayMilliseconds));
            }
        }
        
        if (!authToken) {
            // This case should be covered by the loop's throw, but as a safeguard:
            throw new Error("Failed to obtain authorization token after multiple retries.");
        }
            
        const mgmtOpt: Options = {
            token: authToken.access_token,
            baseUrl: config.managementApiBaseUrl,
            refresh_token: authToken.refresh_token
            // duration and retryCount are optional and will be undefined
        };
            
        this._mgmtApiClient = new ClientInstance(mgmtOpt);

        return {
            apiClient: this._mgmtApiClient,
            guid: this.testConfig.getConfig().guid
        };
    }
} 