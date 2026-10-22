import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../models/model";
import { ModelAvailability } from "../models/modelAvailability";
import { Exception } from "../models/exception";

export class ModelMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getContentModel(id: number, guid: string) {
        try {
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model;
        } catch (err) {
            throw new Exception(`Unable to retrieve model for id: ${id}.`, err);
        }
    }

    async getModelByReferenceName(referenceName: string, guid: string) {
        try {
            let apiPath = `model/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model;
        } catch (err) {
            throw new Exception(`Unable to retrieve model for referenceName: ${referenceName}.`, err);
        }
    }

    async getContentModules(includeDefaults: boolean, guid: string, includeModules: boolean = false) {
        try {
            let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch (err) {
            throw new Exception(`Unable to retrieve content modules.`, err);
        }
    }

    async getPageModules(includeDefault: boolean, guid: string) {
        try {
            let apiPath = `model/list-page-modules/${includeDefault}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch (err) {
            throw new Exception(`Unable to retrieve page modules.`, err);
        }
    }

    async saveModel(model: Model, guid: string) {
        try {
            let apiPath = `model`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, model);

            return resp.data as Model;
        } catch (err) {
            throw new Exception(`Unable to save the model.`, err);
        }
    }

    /**
     * The availability rules of one component model: who can add it, and where it can go.
     * A model with no rules comes back with `addableBy` and `allowedIn` both `null`.
     */
    async getModelAvailability(modelID: number, guid: string) {
        try {
            let apiPath = `model/${modelID}/availability`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ModelAvailability;
        } catch (err) {
            throw new Exception(`Unable to retrieve availability for model id: ${modelID}.`, err);
        }
    }

    /** The availability rules of every model on the instance that has any rule. */
    async getAllModelAvailability(guid: string) {
        try {
            let apiPath = `model/availability`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ModelAvailability[];
        } catch (err) {
            throw new Exception(`Unable to retrieve model availability.`, err);
        }
    }

    /**
     * Save the availability rules of one component model and return them as saved.
     * A group (`addableBy`, `allowedIn`) left out or `null` keeps its stored rules; an object replaces
     * them; an object whose lists are all empty clears them.
     */
    async saveModelAvailability(modelID: number, availability: ModelAvailability, guid: string) {
        try {
            let apiPath = `model/${modelID}/availability`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, availability);

            return resp.data as ModelAvailability;
        } catch (err) {
            throw new Exception(`Unable to save availability for model id: ${modelID}.`, err);
        }
    }

    async deleteModel(id: number, guid: string) {
        try {
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch (err) {
            throw new Exception(`Unable to delete the model`, err);
        }
    }
}