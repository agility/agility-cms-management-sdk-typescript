import { TestConfiguration } from './test.config';
import { Options } from '../../types/options';
import { ClientInstance } from '../../apiMethods/clientInstance';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import axios from 'axios';
import FormData from 'form-data';

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
        const rowKey = process.env.TEST_ENV === "dev" ? "dev" : "prod";
        const partitionKey = 'Integration-Test';
        const currentToken = await this.getCurrentToken(partitionKey, rowKey);
        
        if (!currentToken) {
            throw new Error('No current token found');
        }

        const form = new FormData();
        form.append("refresh_token", currentToken.refresh_token);

        const config = this.testConfig.getConfig();
        const apiPath = `${config.managementApiBaseUrl}/oauth/refresh`;

        const resp = await axios.post(apiPath, form, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        const tokenInfo = resp.data;
        tokenInfo.partitionKey = partitionKey;
        tokenInfo.rowKey = rowKey;

        const tableClient = await this.getTableClient();
        await tableClient.updateEntity(tokenInfo);

        return tokenInfo;
    }

    public async createManagementSdkClient(): Promise<{ apiClient: ClientInstance; guid: string }> {
        if (!this._mgmtApiClient) {
            const config = this.testConfig.getConfig();
            const authToken = await this.getAuthorizationToken();
            
            const mgmtOpt: Options = {
                token: authToken.access_token,
                baseUrl: config.managementApiBaseUrl,
                refresh_token: authToken.refresh_token
                // duration and retryCount are optional and will be undefined
            };
            
            this._mgmtApiClient = new ClientInstance(mgmtOpt);
        }

        return {
            apiClient: this._mgmtApiClient,
            guid: this.testConfig.getConfig().guid
        };
    }
} 