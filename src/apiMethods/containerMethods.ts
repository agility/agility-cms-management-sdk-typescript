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
        } catch(err: any){
            throw new Exception(`Unable to retreive the contianer for id: ${id}`, err as Error);
        }
    }

    async getContainersByModel(modelId: number, guid: string){
        try{
            let apiPath = `container/model/${modelId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch(err: any){
            throw new Exception(`Unable to retreive the containers for id: ${modelId}`, err as Error);
        }
    }

    async getContainerByReferenceName(referenceName: string, guid: string){
        try{
            let apiPath = `container/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch(err: any){
            throw new Exception(`Unable to retreive the contianer for referenceName: ${referenceName}`, err as Error);
        }
    }

    async getContainerSecurity(id: number, guid: string){
        try{
            let apiPath = `container/${id}/security`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch(err: any){
            throw new Exception(`Unable to retreive the contianer for id: ${id}`, err as Error);
        }
    }

    async getContainerList(guid: string){
        try{
            let apiPath = `container/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch(err: any){
            throw new Exception(`Unable to retreive the contianer list`, err as Error);
        }
    }

    async getNotificationList(id: number, guid: string){
        try{
            let apiPath = `container/${id}/notifications`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Notification[];
        } catch(err: any){
            throw new Exception(`Unable to retreive the notifications for contianer id: ${id}`, err as Error);
        }
    }

    async saveContainer(container: Container, guid: string, forceReferenceName: boolean = false){
        try{
            let apiPath = `container${forceReferenceName ? '?forceReferenceName=true' : ''}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, container);

            return resp.data as Container;
        } catch(err: any){
            throw new Exception(`Unable to save the contianer`, err as Error);
        }
    }

    async deleteContainer(id: number, guid: string){
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch(err: any){
            throw new Exception(`Unable to delete the contianer for id: ${id}`, err as Error);
        }
    }
}