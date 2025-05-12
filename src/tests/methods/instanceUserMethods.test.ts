import { InstanceUserMethods } from '../../apiMethods/instanceUserMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { ApiClient } from '../../apiClient';
import { InstanceRole } from '../../types/instanceRole';
import { InstanceUser } from '../../types/instanceUser';
import { WebsiteUser } from '../../types/websiteUser';

describe('InstanceUserMethods', () => {
    let instanceUserMethods: InstanceUserMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;
    let createdTestUser: InstanceUser | null = null; // To store user created for testing save/delete

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl
        };
        
        instanceUserMethods = new InstanceUserMethods(options);
    });

    afterAll(async () => {
        // Clean up any user created during tests
        if (createdTestUser && createdTestUser.userID) {
            try {
                await instanceUserMethods.deleteUser(createdTestUser.userID, guid);
                console.log(`Cleaned up test user: ${createdTestUser.emailAddress}`);
            } catch (error) {
                console.error(`Failed to clean up test user ${createdTestUser.userID}:`, error);
            }
        }
    });

    describe('getUsers', () => {
        it('should retrieve the user list (WebsiteUser object) for the instance', async () => {
            const websiteUser = await instanceUserMethods.getUsers(guid);
            
            expect(websiteUser).toBeDefined();
            // Check properties directly on the WebsiteUser object
            expect(websiteUser).toHaveProperty('userID'); 
            expect(websiteUser).toHaveProperty('emailAddress');
            expect(websiteUser).toHaveProperty('userRoles');
            expect(websiteUser).toHaveProperty('userPermissions');
            expect(Array.isArray(websiteUser.userRoles)).toBe(true);
            expect(Array.isArray(websiteUser.userPermissions)).toBe(true);

        });
    });

    describe('saveUser and deleteUser', () => {
        const testUserEmail = `test-user-${Date.now()}@test.com`;
        const testUserFirstName = 'Test';
        const testUserLastName = 'User';
        // Define a basic role; this might need adjustment based on available roles in your instance
        const testUserRoles: InstanceRole[] = [{
            roleID: 7, // Assuming 'Contributor' role ID; adjust if necessary
            isGlobalRole: false, 
            sort: 0,
            role: 'Contributor', 
            name: 'Contributor'
        }];

        it('should save a new user, then delete them', async () => {
            // Save User
            const savedUser = await instanceUserMethods.saveUser(
                testUserEmail,
                testUserRoles,
                guid,
                testUserFirstName,
                testUserLastName
            );
            createdTestUser = savedUser; // Store for cleanup in afterAll

            expect(savedUser).toBeDefined();
            expect(savedUser).toHaveProperty('userID');
            expect(savedUser.emailAddress).toBe(testUserEmail.toLowerCase()); // Emails might be lowercased
            expect(savedUser.firstName).toBe(testUserFirstName);
            expect(savedUser.lastName).toBe(testUserLastName);
            expect(savedUser.instanceRoles).toEqual(expect.arrayContaining(testUserRoles));

            // Delete User
            if (savedUser && savedUser.userID) {
                const deleteResponse = await instanceUserMethods.deleteUser(savedUser.userID, guid);
                expect(deleteResponse).toBeDefined(); // Or check for specific success message/status
                createdTestUser = null; // User successfully deleted, no need for afterAll cleanup for this one
            } else {
                throw new Error('Failed to save user, cannot proceed with delete test.');
            }
        });

        it('should fail to save a user with an invalid email', async () => {
            const invalidEmail = 'invalid-email';
            await expect(instanceUserMethods.saveUser(invalidEmail, testUserRoles, guid))
                .rejects
                .toThrow(); // Add more specific error checking if API provides it
        });

        it('should fail to delete a non-existent user', async () => {
            const nonExistentUserID = -99999;
            await expect(instanceUserMethods.deleteUser(nonExistentUserID, guid))
                .rejects
                .toThrow(); // Add more specific error checking
        });
    });
}); 