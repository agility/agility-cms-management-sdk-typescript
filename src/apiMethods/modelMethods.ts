import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../models/model";
import { Exception } from "../models/exception";

export class ModelMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getContentModel(id: number, guid: string){
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model;
        } catch(err){
            throw new Exception(`Unable to retreive model for id: ${id}.`, err);
        }
    }

    async getModelByReferenceName(referenceName: string, guid: string){
        try{
            let apiPath = `model/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model;
        } catch(err){
            throw new Exception(`Unable to retreive model for referenceName: ${referenceName}.`, err);
        }
    }

    async getContentModules(includeDefaults: boolean, guid: string, includeModules: boolean = false){
        try{
            let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch(err){
            throw new Exception(`Unable to retreive content modules.`, err);
        }
    }

    async getPageModules(includeDefault: boolean, guid: string){
        try{
            let apiPath = `model/list-page-modules/${includeDefault}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch(err){
            throw new Exception(`Unable to retreive page modules.`, err);
        }
    }

    async saveModel(model: Model, guid: string){
        try{
            let apiPath = `model`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, model);

            return resp.data as Model;
        } catch(err){
            throw new Exception(`Unable to save the model.`, err);
        }
    }

    async deleteModel(id: number, guid: string){
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete the model`, err);
        }
    }
}