import { ApiClient } from '../apiClient';
import { Options } from '../models/options';

describe('SDK', () => {
  let sdk: ApiClient;
  const mockOptions: Options = {
    token: 'test-token',
    baseUrl: 'https://api.agilitycms.com',
    refresh_token: 'test-refresh-token',
    duration: 3000,
    retryCount: 500
  };

  beforeEach(() => {
    sdk = new ApiClient(mockOptions);
  });

  test('should initialize with correct options', () => {
    expect(sdk._options).toEqual(mockOptions);
  });

  test('should initialize all method classes', () => {
    expect(sdk.contentMethods).toBeDefined();
    expect(sdk.assetMethods).toBeDefined();
    expect(sdk.batchMethods).toBeDefined();
    expect(sdk.containerMethods).toBeDefined();
    expect(sdk.instanceUserMethods).toBeDefined();
    expect(sdk.instanceMethods).toBeDefined();
    expect(sdk.modelMethods).toBeDefined();
    expect(sdk.pageMethods).toBeDefined();
    expect(sdk.serverUserMethods).toBeDefined();
    expect(sdk.webhookMethods).toBeDefined();
  });
}); 