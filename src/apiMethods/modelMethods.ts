import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../types/model";
import { Exception } from "../errors/exception";

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
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retreive model for id: ${id}.`, innerError);
        }
    }

    async getModelByReferenceName(referenceName: string, guid: string){
        try{
            let apiPath = `model/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retreive model for referenceName: ${referenceName}.`, innerError);
        }
    }

    async getContentModules(includeDefaults: boolean, guid: string, includeModules: boolean = false){
        try{
            let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retreive content modules.`, innerError);
        }
    }

    async getPageModules(includeDefault: boolean, guid: string){
        try{
            let apiPath = `model/list-page-modules/${includeDefault}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Model[];
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retreive page modules.`, innerError);
        }
    }

    async saveModel(model: Model, guid: string){
        try{
            let apiPath = `model`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, model);

            return resp.data as Model;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to save the model.`, innerError);
        }
    }

    async deleteModel(id: number, guid: string){
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(`API error! status: ${resp.status}, message: ${errorText}`);
            }

            return await resp.text();
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to delete the model with id: ${id}`, innerError);
        }
    }
}