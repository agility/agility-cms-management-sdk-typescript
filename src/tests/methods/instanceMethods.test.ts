import { InstanceMethods } from '../../apiMethods/instanceMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ApiClient } from '../../apiClient';
import { Locales } from '../../types/locales';

describe('InstanceMethods', () => {
    let instanceMethods: InstanceMethods;
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
        
        instanceMethods = new InstanceMethods(options);
    });

    describe('getLocales', () => {
        it('should retrieve a list of locales for the instance', async () => {
            const locales = await instanceMethods.getLocales(guid);
            
            expect(locales).toBeDefined();
            expect(Array.isArray(locales)).toBe(true);
            
            // Check if the array is not empty (assuming every instance has at least one locale)
            expect(locales.length).toBeGreaterThan(0);

            // Check the structure of the first locale object
            if (locales.length > 0) {
                expect(locales[0]).toHaveProperty('name');
                expect(locales[0]).toHaveProperty('code');
                expect(locales[0]).toHaveProperty('isDefault');
            }
        });
    });
}); 