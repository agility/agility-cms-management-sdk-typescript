import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface TestConfig {
    guid: string;
    apiKeyFetch: string;
    apiKeyPreview: string;
    websiteName: string;
    securityKey: string;
    contentServerBaseUrl: string;
    fetchApiBaseUrl: string;
    directFetchApiBaseUrl: string;
    managementApiBaseUrl: string;
}

export class TestConfiguration {
    private static instance: TestConfiguration;
    private config: TestConfig;

    private constructor() {
        const env = process.env.TEST_ENV || 'dev';
        this.config = this.loadConfig(env);
    }

    public static getInstance(): TestConfiguration {
        if (!TestConfiguration.instance) {
            TestConfiguration.instance = new TestConfiguration();
        }
        return TestConfiguration.instance;
    }

    private loadConfig(env: string): TestConfig {
        const prefix = env.toUpperCase().replace(/-/g, '_');
        
        return {
            guid: process.env[`${prefix}_GUID`] || '',
            apiKeyFetch: process.env[`${prefix}_API_KEY_FETCH`] || '',
            apiKeyPreview: process.env[`${prefix}_API_KEY_PREVIEW`] || '',
            websiteName: process.env[`${prefix}_WEBSITE_NAME`] || '',
            securityKey: process.env[`${prefix}_SECURITY_KEY`] || '',
            contentServerBaseUrl: process.env[`${prefix}_CONTENT_SERVER_BASE_URL`] || '',
            fetchApiBaseUrl: process.env[`${prefix}_FETCH_API_BASE_URL`] || '',
            directFetchApiBaseUrl: process.env[`${prefix}_DIRECT_FETCH_API_BASE_URL`] || '',
            managementApiBaseUrl: process.env[`${prefix}_MANAGEMENT_API_BASE_URL`] || ''
        };
    }

    public getConfig(): TestConfig {
        return this.config;
    }

    public getAzureConfig() {
        return {
            storageAccount: process.env.STORAGE_ACCOUNT || '',
            storageAccountKey: process.env.STORAGE_ACCOUNT_KEY || '',
            storageAccountTable: process.env.STORAGE_ACCOUNT_TABLE || ''
        };
    }
} 