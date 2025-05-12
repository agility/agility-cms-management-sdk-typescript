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

        // Fetch a list of containers to get a valid ID and reference name for testing
        try {
            const containers = await containerMethods.getContainerList(guid);
            if (containers && containers.length > 0) {
                testContainer = containers[0];
            }
        } catch (error) {
            console.error("Failed to fetch initial container list in beforeAll:", error);
        }
    });

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
}); 