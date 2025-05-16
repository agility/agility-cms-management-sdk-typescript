import { Exception } from "../errors/exception";
import { Options } from "../types/options";
import { ServerUser } from "../types/serverUser";
import { ClientInstance } from "./clientInstance";

export class ServerUserMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Retrieves the details of the currently authenticated server user (based on the provided token).
     * @param guid The instance GUID (may not be strictly necessary for /users/me, but kept for consistency).
     * @returns A promise resolving to the ServerUser object.
     * @throws {Exception} If user information cannot be retrieved.
     */
    async me(guid: string): Promise<ServerUser> {
        try {
            let apiPath = `/users/me`; // Added leading slash for consistency with executeServerGet base URL
            const resp = await this._clientInstance.executeServerGet(apiPath, guid, this._options.token);
            // Assuming executeServerGet returns the parsed JSON directly
            if (!resp?.userID) { throw new Error("Invalid response structure for ServerUser."); }
            return resp as ServerUser; // Keep assertion for now
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception('Unable to retrieve current user information.', error);
        }
    }

    /**
     * Retrieves the details of a specific server user by their ID.
     * @param guid The instance GUID.
     * @param serverUserID The numeric ID of the server user to retrieve.
     * @returns A promise resolving to the ServerUser object.
     * @throws {Exception} If user information cannot be retrieved.
     */
    async you(guid: string, serverUserID: number): Promise<ServerUser> {
        try {
            let apiPath = `/users/you?srvUserID=${serverUserID}`;
            const resp = await this._clientInstance.executeServerGet(apiPath, guid, this._options.token);
             // Assuming executeServerGet returns the parsed JSON directly
             if (!resp?.userID) { throw new Error("Invalid response structure for ServerUser."); }
            return resp as ServerUser;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve user information for ID: ${serverUserID}.`, error);
        }
    }
}