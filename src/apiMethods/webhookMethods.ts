import { Exception } from "../models/exception";
import { Options } from "../models/options";
import { TokenPagedResult } from "../models/pagedResult";
import { Webhook } from "../models/webhook";
import { WebhookHistory } from "../models/webhookHistory";
import { buildQueryString } from "../util/queryString";
import { ClientInstance } from "./clientInstance";

export class WebhookMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async webhookList(guid: string, take: number = 20, token: string = null){
        try{
            const queryParams = buildQueryString({
                take: take,
                token: token
            });

            let apiPath = `webhook/list${queryParams}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as TokenPagedResult<Webhook>;
        } catch(err){
            throw new Exception(`Unable to get the webhook list`, err);
        }
    }

    async saveWebhook(guid: string, webhook: Webhook){
        try{
            let apiPath = `webhook`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, webhook);

            return resp.data;
        } catch(err){
            throw new Exception('Unable to save webhook.', err);
        }
    }

    async getWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data;
        } catch(err){
            throw new Exception(`Unable to retrieve webhook for webhookID: ${webhookID},`, err);
        }
    }

    async deleteWebhook(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}`;
            await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err){
            throw new Exception(`Unable to delete webhook for webhookID: ${webhookID}.`, err);
        }
    }

    async getWebhookHistory(guid: string, webhookID: string, options?: { fromDate?: string, toDate?: string, take?: number, token?: string }){
        try{
            const queryParams = buildQueryString({
                fromDate: options?.fromDate,
                toDate: options?.toDate,
                take: options?.take,
                token: options?.token
            });

            let apiPath = `webhook/${webhookID}/history${queryParams}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as TokenPagedResult<WebhookHistory>;
        } catch(err){
            throw new Exception(`Unable to retrieve webhook history for webhookID: ${webhookID}.`, err);
        }
    }

    async rotateWebhookSecret(guid: string, webhookID: string){
        try{
            let apiPath = `webhook/${webhookID}/rotate-secret`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            return resp.data as Webhook;
        } catch(err){
            throw new Exception(`Unable to rotate the signing secret for webhookID: ${webhookID}.`, err);
        }
    }
}
