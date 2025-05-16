import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../types/model";
import { Exception } from "../errors/exception";
import { BatchMethods } from "./batchMethods";
import { Batch } from "../types/batch";
// import { DeleteResponse } from "../types/apiResponse";

export class ModelMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    private batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this.batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves a content model by its ID.
     * @param id The numeric ID of the content model.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Model object.
     */
    async getContentModel(id: number, guid: string): Promise<Model> {
        try{
            let apiPath = `model/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.id && resp?.id !== 0) { throw new Error("Invalid response structure for Model."); }
            return resp as Model;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve model for id: ${id}.`, error);
        }
    }

    /**
     * Retrieves a content model by its reference name.
     * @param referenceName The reference name of the model.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Model object.
     */
    async getModelByReferenceName(referenceName: string, guid: string): Promise<Model> {
        try{
            let apiPath = `model/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.id && resp?.id !== 0) { throw new Error("Invalid response structure for Model."); }
            return resp as Model;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve model for referenceName: ${referenceName}.`, error);
        }
    }

    /**
     * Retrieves a list of content modules.
     * @param includeDefaults Whether to include default system modules.
     * @param guid The instance GUID.
     * @param includeModules Whether to include modules (seems redundant with includeDefaults, clarify API).
     * @returns A promise resolving to an array of Model objects.
     */
    async getContentModules(includeDefaults: boolean, guid: string, includeModules: boolean = false): Promise<Model[]> {
        try{
            let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Model list."); }
            return resp as Model[];
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve content modules.`, error);
        }
    }

    /**
     * Retrieves a list of page modules.
     * @param includeDefault Whether to include default system page modules.
     * @param guid The instance GUID.
     * @returns A promise resolving to an array of Model objects.
     */
    async getPageModules(includeDefault: boolean, guid: string): Promise<Model[]> {
        try{
            let apiPath = `model/list-page-modules/${includeDefault}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Model list."); }
            return resp as Model[];
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve page modules.`, error);
        }
    }

    /**
     * Saves (creates or updates) a content model. Assumed to be synchronous.
     * @param model The Model object to save.
     * @param guid The instance GUID.
     * @returns A promise resolving to the saved Model object.
     */
    async saveModel(model: Model, guid: string): Promise<Model> {
        try{
            let apiPath = `model`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, model);

            if (!resp?.id && resp?.id !== 0) { throw new Error("Invalid response structure for saved Model."); }
            return resp as Model;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to save the model.`, error);
        }
    }

    /**
     * Deletes a content model. Assumes this is a batch operation.
     * @param id The ID of the model to delete.
     * @param guid The instance GUID.
     * @returns A promise resolving to the final Batch object after the deletion completes.
     */
    async deleteModel(id: number, guid: string): Promise<Batch> {
        try{
            let apiPath = `model/${id}`;
            const initialResp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
            
            if (!initialResp?.batchID && initialResp?.batchID !== 0) {
                throw new Error('Delete model did not return a valid batch ID.');
            }
            const initialBatch = initialResp as Batch;

            if (typeof initialBatch.batchID !== 'number') {
                throw new Error('Batch ID from delete model is not a number.');
            }

            return await this.batchMethods.Retry(async () => this.batchMethods.getBatch(initialBatch.batchID!, guid));
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete the model with id: ${id}`, error);
        }
    }
}