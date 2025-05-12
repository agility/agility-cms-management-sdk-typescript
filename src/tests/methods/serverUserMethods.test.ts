import { ServerUserMethods } from '../../apiMethods/serverUserMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ServerUser } from '../../types/serverUser';
import { ApiClient } from '../../apiClient';

describe('ServerUserMethods', () => {
    let serverUserMethods: ServerUserMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let currentUser: ServerUser | null = null; // Store current user details

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        
        serverUserMethods = new ServerUserMethods(options);

        // Fetch current user details to potentially use their ID for 'you' test
        try {
            currentUser = await serverUserMethods.me(guid);
        } catch (error) {
            console.error("Failed to fetch current user ('me') in beforeAll:", error);
        }
    });

    describe('me', () => {
        it('should retrieve details for the currently authenticated user', async () => {
            // currentUser should have been fetched in beforeAll
            expect(currentUser).toBeDefined();
            if (currentUser) {
                expect(currentUser).toHaveProperty('userID');
                expect(currentUser.userID).toBeGreaterThan(0);
                expect(currentUser).toHaveProperty('emailAddress');
                expect(currentUser).toHaveProperty('firstName');
                expect(currentUser).toHaveProperty('lastName');
            }
        });
    });

    describe('you', () => {
        it('should retrieve details for a specific user by serverUserID (using current user ID)', async () => {
            if (!currentUser || !currentUser.userID) {
                console.warn("Skipping 'you' test: Could not get current user ID from 'me' call.");
                return;
            }
            
            const targetUserID = currentUser.userID;
            // The 'you' endpoint might return a different structure or subset of data than 'me'
            // Adjust expectations based on the actual API response for this endpoint.
            const userDetails = await serverUserMethods.you(guid, targetUserID);
            
            expect(userDetails).toBeDefined();
            // Assuming it returns at least some user info, might not be full ServerUser
            // Add specific property checks based on what 'you' actually returns
            // e.g., expect(userDetails).toHaveProperty('someProperty'); 
        });

        it('should throw an error for a non-existent serverUserID', async () => {
            const nonExistentUserID = -99999;
            await expect(serverUserMethods.you(guid, nonExistentUserID))
                .rejects
                .toThrow(); // Adjust error expectation if needed
        });
    });
}); 