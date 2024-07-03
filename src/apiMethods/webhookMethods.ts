import { Exception } from "../models/exception";
import { Options } from "../models/options";
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
            throw new Exception(`Unable to get the webhook list`);
        }
    }
}