import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Locales } from "../models/locales";
import { FetchApiStatus, FetchApiSyncMode } from "../models/fetchApiStatus";
import { Exception } from "../models/exception";

export class InstanceMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getLocales(guid: string) {
        try {
            const apiPath = `locales`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as Locales[];
        } catch (err) {
            throw new Exception("Unable to retrieve locales.", err);
        }
    }

    /**
     * Gets the Fetch API sync status for an instance.
     * Use this to check if changes made via the Management API have propagated to the Fetch API CDNs.
     * This is particularly useful after large batch operations or batch workflows to verify
     * that content changes are available on the CDN before proceeding with dependent operations.
     * 
     * @param guid - The website GUID
     * @param mode - Sync mode: 'fetch' (live/published content) or 'preview' (preview content). Defaults to 'fetch'.
     * @param waitForCompletion - If true, polls until sync is complete. Defaults to false.
     * @returns The sync status including whether a sync is in progress and version information
     */
    async getFetchApiStatus(
        guid: string, 
        mode: FetchApiSyncMode = 'fetch',
        waitForCompletion: boolean = false
    ): Promise<FetchApiStatus> {
        try {
            const apiPath = `fetch-api-status?mode=${mode}`;
            
            if (!waitForCompletion) {
                const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
                return resp.data as FetchApiStatus;
            }

            // Poll until sync is complete
            while (true) {
                const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
                const status = resp.data as FetchApiStatus;
                
                if (!status.inProgress) {
                    return status;
                }

                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (err) {
            throw new Exception("Unable to retrieve Fetch API status.", err);
        }
    }
}
