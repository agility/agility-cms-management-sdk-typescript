import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Locales } from "../types/locales";
import { Exception } from "../errors/exception";

export class InstanceMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Retrieves the list of locales configured for the instance.
     * @param guid The instance GUID.
     * @returns A promise that resolves to an array of locale objects.
     * @throws {Exception} Throws an exception if the locales cannot be retrieved.
     */
    async getLocales(guid: string): Promise<Locales[]> {
        try {
            const apiPath = `locales`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            
            if (!Array.isArray(resp?.data)) {
                throw new Error('API response for locales is not an array');
            }
            return resp.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception("Unable to retrieve locales.", error);
        }
    }
}