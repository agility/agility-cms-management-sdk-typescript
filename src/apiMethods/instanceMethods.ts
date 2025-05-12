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

    async getLocales(guid: string) {
        try {
            const apiPath = `locales`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as Locales[];
        } catch (err) {
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception("Unable to retrieve locales.", innerError);
        }
    }
}