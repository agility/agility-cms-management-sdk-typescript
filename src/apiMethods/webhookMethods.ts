import { Exception } from "../models/exception";
import { Options } from "../models/options";
import { Webhook } from "../models/webhook";
import { ClientInstance } from "./clientInstance";

export class WebhookMethods{
    _options!: Options;
    _cleintInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._cleintInstance = new ClientInstance(this._options);
    }

    async webhookList(guid: string, take: number = 20, token: string = null){
        try{
            let apiPath = `webhook/list`;
            const resp = await this._cleintInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data;
        } catch(err){
            throw new Exception(`Unable to get the webhook list`, err);
        }
    }

    async saveWebhook(guid: string, webhook: Webhook){
        try{
            let apiPath = `webhook`;
            const resp = await this._cleintInstance.executePost(apiPath, guid, this._options.token, webhook);

            return resp.data;
        } catch(err){
            throw new Exception('Unable to save webhook.', err);
        }
    }

    async getWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            const resp = await this._cleintInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data;
        } catch(err){
            throw new Exception(`Unable to retrieve webhook for webhookID: ${webhookID},`, err);
        }
    }

    async deleteWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            await this._cleintInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err){
            throw new Exception(`Unable to delete webhook for webhookID: ${webhookID}.`, err);
        }
    }
}