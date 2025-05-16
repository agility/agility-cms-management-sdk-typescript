import { Exception } from "../errors/exception";
import { Options } from "../types/options";
import { Webhook } from "../types/webhook";
import { ClientInstance } from "./clientInstance";
// Import Batch types just in case save/delete are actually batch, although assuming sync for now
// import { BatchMethods } from "./batchMethods"; 
// import { Batch } from "../types/batch"; 
// import { DeleteResponse } from "../types/apiResponse";

export class WebhookMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;
    // private batchMethods: BatchMethods; // Only needed if assuming batch operations

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        // this.batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves a list of webhooks for the instance.
     * @param guid The instance GUID.
     * @param take The maximum number of webhooks to return (default 20).
     * @param token Optional override security token.
     * @returns A promise resolving to an array of Webhook objects.
     */
    async webhookList(guid: string, take: number = 20, token: string | null = null): Promise<Webhook[]> {
        try {
            let apiPath = `webhook/list?take=${take}`;
            const effectiveToken = token ?? this._options.token;
            const resp = await this._clientInstance.executeGet(apiPath, guid, effectiveToken);
            // Assuming resp is array of Webhook
            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Webhook list."); }
            return resp as Webhook[];
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to get the webhook list`, error);
        }
    }

    /**
     * Saves (creates or updates) a webhook. Assumed synchronous.
     * @param guid The instance GUID.
     * @param webhook The Webhook object to save.
     * @returns A promise resolving to the saved Webhook object.
     */
    async saveWebhook(guid: string, webhook: Webhook): Promise<Webhook> {
        try {
            let apiPath = `webhook`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, webhook);
            // Assuming resp is the saved Webhook
            if (!resp?.webhookID) { throw new Error("Invalid response structure for saved Webhook."); }
            return resp as Webhook;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception('Unable to save webhook.', error);
        }
    }

    /**
     * Retrieves a specific webhook by its ID.
     * @param guid The instance GUID.
     * @param webhookID The ID of the webhook.
     * @returns A promise resolving to the Webhook object.
     */
    async getWebhook(guid: string, webhookID: string): Promise<Webhook> {
        try {
            let apiPath = `webhook/${webhookID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
             // Assuming resp is the Webhook
             if (!resp?.webhookID) { throw new Error("Invalid response structure for Webhook."); }
            return resp as Webhook;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve webhook for webhookID: ${webhookID}.`, error);
        }
    }

    /**
     * Deletes a specific webhook. Assumed synchronous.
     * @param guid The instance GUID.
     * @param webhookID The ID of the webhook to delete.
     * @returns A promise resolving when the deletion is complete.
     */
    async deleteWebhook(guid: string, webhookID: string): Promise<void> { // Return void as original code ignored response
        try {
            let apiPath = `webhook/${webhookID}`;
            // We don't need the response object if the operation is void
            await this._clientInstance.executeDelete(apiPath, guid, this._options.token); 
            // If executeDelete throws on non-OK status, we don't need further checks here.
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete webhook for webhookID: ${webhookID}.`, error);
        }
    }
}