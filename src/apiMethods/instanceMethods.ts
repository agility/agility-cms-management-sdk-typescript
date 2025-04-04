import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Locales } from "../models/locales";
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
            const apiPath = `instance/${guid}/locales`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as Locales[];
        } catch (err) {
            throw new Exception("Unable to retrieve locales.", err);
        }
    }
}