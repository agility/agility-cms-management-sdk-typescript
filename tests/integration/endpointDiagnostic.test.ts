import { ApiClient } from '../../src/apiClient';
import { createTestClient, getTestConfig } from '../utils/testClient';

describe('API Endpoint Diagnostic Tests', () => {
	let client: ApiClient;
	let config: any;

	beforeAll(async () => {
		config = getTestConfig();
		client = createTestClient();
	});

	describe('GET Endpoint Health Check', () => {
		const endpoints = [
			{
				name: 'getLocales',
				test: () => client.instanceMethods.getLocales(config.guid),
				expectedSuccess: true,
			},
			{
				name: 'getContentModules',
				test: () => client.modelMethods.getContentModules(true, config.guid),
				expectedSuccess: true,
			},
			{
				name: 'getPageModules',
				test: () => client.modelMethods.getPageModules(true, config.guid),
				expectedSuccess: true,
			},
			{
				name: 'getGalleries',
				test: () => client.assetMethods.getGalleries(config.guid, '', 50, 0),
				expectedSuccess: true,
			},
			{
				name: 'getMediaList',
				test: () => client.assetMethods.getMediaList(config.guid, '/'),
				expectedSuccess: true,
			},
			{
				name: 'getContainerList',
				test: () => client.containerMethods.getContainerList(config.guid),
				expectedSuccess: true,
			},
		];

		endpoints.forEach(endpoint => {
			it(`should test ${endpoint.name} endpoint`, async () => {
				console.log(`\n🔍 Testing ${endpoint.name}...`);

				try {
					const result = await endpoint.test();

					console.log(`✅ ${endpoint.name} SUCCESS`);
					console.log(`  - Response type: ${typeof result}`);
					console.log(`  - Response defined: ${result !== undefined && result !== null}`);

					if (result && typeof result === 'object') {
						console.log(`  - Response keys: ${Object.keys(result).join(', ')}`);

						// Check for common array properties
						const arrayProps = ['items', 'assetMediaGroupings', 'data', 'list'];
						for (const prop of arrayProps) {
							if ((result as any)[prop]) {
								console.log(
									`  - Found ${prop}: ${Array.isArray((result as any)[prop]) ? 'array' : 'not array'} with ${(result as any)[prop].length || 0} items`
								);
							}
						}
					}

					if (endpoint.expectedSuccess) {
						expect(result).toBeDefined();
					}
				} catch (error) {
					console.log(`❌ ${endpoint.name} FAILED`);
					console.log(`  - Error type: ${error?.constructor?.name}`);
					console.log(`  - Error message: ${(error as any)?.message}`);

					// Check if it's an HTTP error
					if ((error as any)?.innerError?.response) {
						const httpError = (error as any).innerError;
						console.log(`  - HTTP Status: ${httpError.response.status}`);
						console.log(`  - HTTP Status Text: ${httpError.response.statusText}`);
						console.log(`  - Response Data:`, JSON.stringify(httpError.response.data, null, 2));
					}

					// For diagnostic purposes, we'll log but not fail the test
					if (endpoint.expectedSuccess) {
						console.log(`  - This endpoint was expected to succeed but failed`);
					}
				}
			});
		});
	});

	describe('POST Endpoint Behavior (Creation)', () => {
		it('should test saveGallery creation behavior', async () => {
			console.log('\n🔍 Testing saveGallery creation...');

			const testGallery = {
				mediaGroupingID: 0,
				name: `Diagnostic Test Gallery ${Date.now()}`,
				description: 'Test gallery for diagnostic purposes',
				groupingType: 1,
				groupingTypeID: 1,
				modifiedBy: null,
				modifiedByName: null,
				modifiedOn: null,
				isDeleted: false,
				isFolder: false,
				metaData: {},
			};

			try {
				const result = await client.assetMethods.saveGallery(config.guid, testGallery);
				console.log('✅ saveGallery SUCCESS');
				console.log('  - Created gallery:', result);
			} catch (error) {
				console.log('❌ saveGallery FAILED');
				console.log('  - Error:', (error as any)?.message);

				if ((error as any)?.innerError?.response) {
					const httpError = (error as any).innerError;
					console.log('  - HTTP Status:', httpError.response.status);
					console.log('  - Response Data:', JSON.stringify(httpError.response.data, null, 2));

					// This is the key insight - check if it's failing instead of proper validation
					if (httpError.response.status >= 500) {
						console.log(
							'  - 🚨 SERVER ERROR: This endpoint is failing with 5xx instead of proper validation'
						);
					} else if (httpError.response.status >= 400) {
						console.log('  - 📋 CLIENT ERROR: This might be a validation or not found issue');
					}
				}
			}
		});

		it('should test saveModel creation behavior', async () => {
			console.log('\n🔍 Testing saveModel creation...');

			const testModel = {
				id: 0,
				displayName: `Diagnostic Test Model ${Date.now()}`,
				referenceName: `DiagnosticModel${Date.now()}`,
				description: 'Test model for diagnostic purposes',
				lastModified: new Date().toISOString(),
				fields: [
					{
						name: 'Title',
						label: 'Title',
						type: 'Text',
						description: 'Test field',
						designerOnly: false,
						editable: true,
						hiddenField: false,
						itemOrder: 1,
						labelHelpDescription: '',
						settings: { required: true },
					},
				],
			};

			try {
				const result = await client.modelMethods.saveModel(testModel, config.guid);
				console.log('✅ saveModel SUCCESS');
				console.log('  - Created model:', result?.displayName);
			} catch (error) {
				console.log('❌ saveModel FAILED');
				console.log('  - Error:', (error as any)?.message);

				if ((error as any)?.innerError?.response) {
					const httpError = (error as any).innerError;
					console.log('  - HTTP Status:', httpError.response.status);
					console.log('  - Response Data:', JSON.stringify(httpError.response.data, null, 2));

					if (httpError.response.status >= 500) {
						console.log(
							'  - 🚨 SERVER ERROR: This endpoint is failing with 5xx instead of proper validation'
						);
					} else if (httpError.response.status >= 400) {
						console.log('  - 📋 CLIENT ERROR: This might be a validation or not found issue');
					}
				}
			}
		});
	});
});
