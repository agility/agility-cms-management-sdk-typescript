import { Exception } from "../errors/exception";
import { Options } from "../types/options";
import { Webhook } from "../types/webhook";
import { ClientInstance } from "./clientInstance";

export class WebhookMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async webhookList(guid: string, take: number = 20, token: string | null = null){
        try{
            let apiPath = `webhook/list?take=${take}`;
            const effectiveToken = token ?? this._options.token;
            const resp = await this._clientInstance.executeGet(apiPath, guid, effectiveToken);

            return resp.data;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to get the webhook list`, innerError);
        }
    }

    async saveWebhook(guid: string, webhook: Webhook){
        try{
            let apiPath = `webhook`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, webhook);

            return resp.data;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception('Unable to save webhook.', innerError);
        }
    }

    async getWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve webhook for webhookID: ${webhookID},`, innerError);
        }
    }

    async deleteWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to delete webhook for webhookID: ${webhookID}.`, innerError);
        }
    }
}