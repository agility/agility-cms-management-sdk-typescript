import { ModelMethods } from '../../apiMethods/modelMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ApiClient } from '../../apiClient';
import { Model } from '../../types/model';

describe('ModelMethods', () => {
    let modelMethods: ModelMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let testModel: Model | null = null; // Store a fetched model for testing ID/RefName lookups

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        modelMethods = new ModelMethods(options);

        // Attempt to fetch an existing model for testing
        try {
            const models = await modelMethods.getContentModules(false, guid); // Fetch content models
            if (models && models.length > 0) {
                testModel = models[0]; 
            } else {
                console.warn('Could not find any content models in beforeAll.');
            }
        } catch (error) {
            console.error("Failed to fetch initial model list in beforeAll:", error);
        }
    });

    describe('getContentModel', () => {
        it('should retrieve a specific content model by ID', async () => {
            if (!testModel || !testModel.id) {
                console.warn("Skipping getContentModel test: No test model found.");
                return;
            }
            const modelID = testModel.id;
            const model = await modelMethods.getContentModel(modelID, guid);

            expect(model).toBeDefined();
            expect(model).toHaveProperty('id', modelID);
            expect(model).toHaveProperty('referenceName', testModel.referenceName);
        });

        it('should throw an error for a non-existent model ID', async () => {
            const nonExistentID = -99999;
            await expect(modelMethods.getContentModel(nonExistentID, guid))
                .rejects
                .toThrow();
        });
    });

    describe('getModelByReferenceName', () => {
        it('should retrieve a specific model by reference name', async () => {
            if (!testModel || !testModel.referenceName) {
                console.warn("Skipping getModelByReferenceName test: No test model found.");
                return;
            }
            const referenceName = testModel.referenceName;
            const model = await modelMethods.getModelByReferenceName(referenceName, guid);

            expect(model).toBeDefined();
            expect(model).toHaveProperty('referenceName', referenceName);
            expect(model).toHaveProperty('id', testModel.id);
        });

        it('should throw an error for a non-existent reference name', async () => {
            const nonExistentRefName = 'non_existent_model_ref_name';
            await expect(modelMethods.getModelByReferenceName(nonExistentRefName, guid))
                .rejects
                .toThrow();
        });
    });

    describe('getContentModules', () => {
        it('should retrieve a list of content modules (models)', async () => {
            const models = await modelMethods.getContentModules(false, guid); // includeDefaults = false

            expect(models).toBeDefined();
            expect(Array.isArray(models)).toBe(true);
            if (models.length > 0) {
                expect(models[0]).toHaveProperty('id');
                expect(models[0]).toHaveProperty('referenceName');
                expect(models[0]).toHaveProperty('displayName');
            }
        });
    });

    describe('getPageModules', () => {
        it('should retrieve a list of page modules (models)', async () => {
            const models = await modelMethods.getPageModules(false, guid); // includeDefault = false

            expect(models).toBeDefined();
            expect(Array.isArray(models)).toBe(true);
            // Structure check can be similar to getContentModules if needed
        });
    });

    // Basic tests for save/delete - requires creating a valid Model object
    // and proper cleanup (potentially in afterAll or afterEach)
    describe('saveModel and deleteModel', () => {
        let createdModelId: number | null = null;

        // Define a model structure based on the actual Model class
        const testModelData: Model = {
            id: 0, // API should assign ID on creation
            referenceName: `testmodel${Date.now()}`,
            displayName: 'Test Model',
            description: 'Temporary model for testing',
            allowTagging: false,
            fields: [], // Add required fields if necessary
            // Initialize other required properties to null or default values
            lastModifiedDate: null,
            lastModifiedBy: null,
            lastModifiedAuthorID: null,
            contentDefinitionTypeName: null, // Might need a valid type name
            isPublished: null, 
            wasUnpublished: null
        };

        it.skip('should save a new model and then delete it', async () => {
            // Save
            const savedModel = await modelMethods.saveModel(testModelData, guid);
            expect(savedModel).toBeDefined();
            expect(savedModel.id).toBeGreaterThan(0);
            expect(savedModel.referenceName).toBe(testModelData.referenceName);
            createdModelId = savedModel.id;

            // Delete
            if (createdModelId) {
                const deleteResponse = await modelMethods.deleteModel(createdModelId, guid);
                expect(deleteResponse).toBeDefined(); // Check for success indication
                createdModelId = null; // Mark as deleted
            } else {
                throw new Error('Model creation failed, cannot test delete.')
            }
        });

        // Optional: Add cleanup in afterAll if a test fails after creation but before deletion
        afterAll(async () => {
            if (createdModelId) {
                try {
                    await modelMethods.deleteModel(createdModelId, guid);
                    console.log(`Cleaned up test model ID: ${createdModelId}`);
                } catch (err) {
                    console.error(`Failed to cleanup test model ID ${createdModelId}:`, err);
                }
            }
        });
    });
}); 