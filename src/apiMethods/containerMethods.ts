import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Container } from "../models/container";
import { Notification } from "../models/notification";
import { Exception } from "../models/exception";

export class ContainerMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getContainerByID(id: number, guid: string){
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch(err){
            throw new Exception(`Unable to retreive the contianer for id: ${id}`, err);
        }
    }

    async getContainersByModel(modelId: number, guid: string){
        try{
            let apiPath = `container/model/${modelId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch(err){
            throw new Exception(`Unable to retreive the containers for id: ${modelId}`, err);
        }
    }

    async getContainerByReferenceName(referenceName: string, guid: string){
        try{
            let apiPath = `container/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch(err){
            throw new Exception(`Unable to retreive the contianer for referenceName: ${referenceName}`, err);
        }
    }

    async getContainerSecurity(id: number, guid: string){
        try{
            let apiPath = `container/${id}/security`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch(err){
            throw new Exception(`Unable to retreive the contianer for id: ${id}`, err);
        }
    }

    async getContainerList(guid: string){
        try{
            let apiPath = `container/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch(err){
            throw new Exception(`Unable to retreive the contianer list`, err);
        }
    }

    async getNotificationList(id: number, guid: string){
        try{
            let apiPath = `container/${id}/notifications`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Notification[];
        } catch(err){
            throw new Exception(`Unable to retreive the notifications for contianer id: ${id}`, err);
        }
    }

    async saveContainer(container: Container, guid: string, forceReferenceName?: boolean){
        try{
            let apiPath = `container${forceReferenceName !== undefined ? `?forceReferenceName=${forceReferenceName}` : ''}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, container);

            return resp.data as Container;
        } catch(err){
            throw new Exception(`Unable to save the contianer`, err);
        }
    }

    async deleteContainer(id: number, guid: string){
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete the contianer for id: ${id}`, err);
        }
    }
}