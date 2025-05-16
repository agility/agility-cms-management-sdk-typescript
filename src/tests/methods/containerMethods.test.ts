import { ContainerMethods } from '../../apiMethods/containerMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { Container } from '../../types/container';

describe('ContainerMethods', () => {
    let containerMethods: ContainerMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let testContainer: Container | null = null; // Used to store a container retrieved for testing

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        containerMethods = new ContainerMethods(options);

        // Fetch a list of containers and try to find a verifiable one for testing
        try {
            const containers = await containerMethods.getContainerList(guid);
            if (containers && containers.length > 0) {
                for (const potentialContainer of containers) {
                    if (potentialContainer.contentViewID && potentialContainer.referenceName) {
                        try {

                            console.log('potentialContainer');

                            console.log(potentialContainer.contentViewID);
                            // Attempt to fetch the container by its ID to verify it's retrievable
                            const fetchedContainer = await containerMethods.getContainerByID(Number(potentialContainer.contentViewID), guid);
                            
                            // If successfully fetched and properties seem valid, use this container
                            if (fetchedContainer && fetchedContainer.contentViewID === potentialContainer.contentViewID) {
                                testContainer = fetchedContainer; // Use the container that was successfully fetched
                                console.log(`Using container ID: ${testContainer.contentViewID}, Name: ${testContainer.referenceName} for tests.`);
                                break; // Found a suitable container
                            }
                        } catch (e) {
                            // This container couldn't be verified, log and try next
                            console.warn(`Could not verify container ID: ${potentialContainer.contentViewID} (${potentialContainer.referenceName}). Trying next.`);
                        }
                    }
                }
                if (!testContainer) {
                    console.warn("Failed to find a verifiable test container from the list. Some tests may be skipped or fail.");
                }
            }
        } catch (error) {
            console.error("Failed to fetch initial container list in beforeAll:", error);
        }
    }, 30000); // Increased timeout to 30 seconds

    describe('getContainerList', () => {
        it('should retrieve a list of containers', async () => {
            const containers = await containerMethods.getContainerList(guid);
            
            expect(containers).toBeDefined();
            expect(Array.isArray(containers)).toBe(true);
            // Add more specific checks if needed, e.g., check if the list is not empty if expected
            if (containers.length > 0) {
                expect(containers[0]).toHaveProperty('contentViewID');
                expect(containers[0]).toHaveProperty('referenceName');
            }
        });
    });

    describe('getContainerByID', () => {
        it('should retrieve a specific container by ID', async () => {
            // Skip if no container was found in beforeAll
            if (!testContainer || !testContainer.contentViewID) {
                console.warn("Skipping getContainerByID test: No test container found.");
                return;
            }
            
            const containerID = testContainer.contentViewID;
            const container = await containerMethods.getContainerByID(containerID, guid);
            
            expect(container).toBeDefined();
            expect(container).toHaveProperty('contentViewID', containerID);
            expect(container).toHaveProperty('referenceName', testContainer.referenceName);
        });

        it('should throw an error for a non-existent container ID', async () => {
            const nonExistentID = -99999;
            await expect(containerMethods.getContainerByID(nonExistentID, guid))
                .rejects
                .toThrow();
        });
    });

    describe('getContainerByReferenceName', () => {
        it('should retrieve a specific container by reference name', async () => {
             // Skip if no container was found in beforeAll
             if (!testContainer || !testContainer.referenceName) {
                console.warn("Skipping getContainerByReferenceName test: No test container found.");
                return;
            }

            const referenceName = testContainer.referenceName;
            const container = await containerMethods.getContainerByReferenceName(referenceName, guid);
            
            expect(container).toBeDefined();
            expect(container).toHaveProperty('referenceName', referenceName);
            expect(container).toHaveProperty('contentViewID', testContainer.contentViewID);
        });

        it('should throw an error for a non-existent reference name', async () => {
            const nonExistentRefName = 'non_existent_container_ref_name';
            await expect(containerMethods.getContainerByReferenceName(nonExistentRefName, guid))
                .rejects
                .toThrow();
        });
    });

    // Add describe blocks and tests for other methods like:
    // getContainersByModel, getContainerSecurity, getNotificationList, saveContainer, deleteContainer

    describe('getContainersByModel', () => {
        it.todo('should retrieve containers for a given model ID');
        it.todo('should return an empty array if no containers exist for a model ID');
        it.todo('should throw an error for an invalid model ID');
    });

    describe('getContainerSecurity', () => {
        it.todo('should retrieve security information for a container');
        it.todo('should throw an error if the container ID does not exist');
    });

    describe('getNotificationList', () => {
        it.todo('should retrieve the list of notifications for a container');
        it.todo('should return an empty array if there are no notifications');
        it.todo('should throw an error if the container ID does not exist');
    });

    describe('saveContainer', () => {
        it.todo('should create a new container when one does not exist (forceReferenceName: false)');
        it.todo('should create a new container when one does not exist (forceReferenceName: true)');
        it.todo('should update an existing container (forceReferenceName: false)');
        it.todo('should update an existing container (forceReferenceName: true)');
        it.todo('should throw an error if the container data is invalid');
    });

    describe('deleteContainer', () => {
        it.todo('should delete an existing container');
        it.todo('should throw an error if the container ID does not exist');
        it.todo('should confirm the batch operation for deletion');
    });
}); 