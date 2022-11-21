import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Model } from "../models/model";
export declare class ModelMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    constructor(options: Options);
    getContentModel(id: number): Promise<Model>;
    getContentModules(includeDefaults: boolean, includeModules?: boolean): Promise<Model[]>;
    getPageModules(includeDefault: boolean): Promise<Model[]>;
    saveModel(model: Model): Promise<Model>;
    deleteModel(id: number): Promise<string>;
}
