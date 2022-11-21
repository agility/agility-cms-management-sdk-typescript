import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Container } from "../models/container";
import { Notification } from "../models/notification";

export class ContainerMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
    }

    async getContainerByID(id: number){
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Container;
        } catch(err){
            throw `Unable to retreive the contianer for id: ${id}`;
        }
    }

    async getContainerByReferenceName(referenceName: string){
        try{
            let apiPath = `container/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Container;
        } catch(err){
            throw `Unable to retreive the contianer for referenceName: ${referenceName}`;
        }
    }

    async getContainerSecurity(id: number){
        try{
            let apiPath = `container/${id}/security`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Container;
        } catch(err){
            throw `Unable to retreive the contianer for id: ${id}`;
        }
    }

    async getContainerList(){
        try{
            let apiPath = `container/list`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Container[];
        } catch(err){
            throw `Unable to retreive the contianer list`;
        }
    }

    async getNotificationList(id: number){
        try{
            let apiPath = `container/${id}/notifications`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Notification[];
        } catch(err){
            throw `Unable to retreive the notifications for contianer id: ${id}`;
        }
    }

    async saveContainer(container: Container){
        try{
            let apiPath = `container`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, container);

            return resp.data as Container;
        } catch(err){
            throw `Unable to save the contianer`;
        }
    }

    async deleteContainer(id: number){
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, this._options);

            return resp.data as string;
        } catch(err){
            throw `Unable to delete the contianer for id: ${id}`;
        }
    }
}