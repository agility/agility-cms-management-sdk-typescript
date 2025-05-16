import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { InstanceUser } from "../types/instanceUser";
import { WebsiteUser } from "../types/websiteUser";
import { InstanceRole } from "../types/instanceRole";
import { Exception } from "../errors/exception";
// Import Batch types just in case save/delete are actually batch, although assuming sync for now
// import { BatchMethods } from "./batchMethods"; 
// import { Batch } from "../types/batch"; 
// import { DeleteResponse } from "../types/apiResponse";

export class InstanceUserMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;
    // private batchMethods: BatchMethods; // Only needed if assuming batch operations for save/delete

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        // this.batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves a list of website users for the instance.
     * @param guid The instance GUID.
     * @returns A promise resolving to an array of WebsiteUser objects.
     */
    async getUsers(guid: string): Promise<WebsiteUser[]> { // Assuming this returns a list
        try {
            let apiPath = `user/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            // Assuming resp is array of WebsiteUser
            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for WebsiteUser list."); }
            return resp as WebsiteUser[];
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve users.`, error);
        }
    }

    /**
     * Saves (creates or updates) an instance user.
     * @param emailAddress The email address of the user.
     * @param roles An array of roles to assign to the user.
     * @param guid The instance GUID.
     * @param firstName Optional first name of the user.
     * @param lastName Optional last name of the user.
     * @returns A promise resolving to the saved InstanceUser object.
     */
    async saveUser(emailAddress: string, roles: InstanceRole[], guid: string, firstName: string | null = null, lastName: string | null = null): Promise<InstanceUser> {
        try {
            // Ensure names are empty strings if null for the query param
            const fNameParam = firstName ?? '';
            const lNameParam = lastName ?? '';
            let apiPath = `user/save?emailAddress=${encodeURIComponent(emailAddress)}&firstName=${encodeURIComponent(fNameParam)}&lastName=${encodeURIComponent(lNameParam)}`;
            
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, roles);
            // Assuming resp is the saved InstanceUser
            if (!resp?.userID) { throw new Error("Invalid response structure for saved InstanceUser."); }
            return resp as InstanceUser;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to save user.`, error);
        }
    }

    /**
     * Deletes an instance user by their ID.
     * @param userId The numeric ID of the user to delete.
     * @param guid The instance GUID.
     * @returns A promise resolving when the deletion is complete.
     */
    async deleteUser(userId: number, guid: string): Promise<void> { // Return void as original code processed text then ignored it for return
        try {
            let apiPath = `user/delete/${userId}`;
            // ClientInstance.executeDelete will throw if !resp.ok
            // If it returns a JSON with a message, it will be returned, otherwise { message: "..." }
            // Since the original code only checked resp.ok and then resp.text() but didn't return it, we assume void is acceptable.
            await this._clientInstance.executeDelete(apiPath, guid, this._options.token); 
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete the user for id: ${userId}`, error);
        }
    }
}