import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../models/model";

export class ModelMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
    }

    async getContentModel(id: number){
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Model;
        } catch(err){
            throw `Unable to retreive model for id: ${id}.`;
        }
    }

    async getContentModules(includeDefaults: boolean, includeModules: boolean = false){
        try{
            let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Model[];
        } catch(err){
            throw `Unable to retreive content modules.`;
        }
    }

    async getPageModules(includeDefault: boolean){
        try{
            let apiPath = `model/list-page-modules/${includeDefault}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Model[];
        } catch(err){
            throw `Unable to retreive page modules.`;
        }
    }

    async saveModel(model: Model){
        try{
            let apiPath = `model`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, model);

            return resp.data as Model;
        } catch(err){
            throw `Unable to save the model ${err}`;
        }
    }

    async deleteModel(id: number){
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, this._options);

            return resp.data as string;
        } catch(err){
            throw `Unable to delete the model ${err}`;
        }
    }
}