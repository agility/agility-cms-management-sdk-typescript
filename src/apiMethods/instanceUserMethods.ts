import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { InstanceUser } from "../models/instanceUser";
import { WebsiteUser } from "../models/websiteUser";
import { InstanceRole } from "../models/instanceRole";
import { Exception } from "../models/exception";

export class InstanceUserMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getUsers(guid: string){
        try{
            let apiPath = `user/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as WebsiteUser;
        } catch(err){
            throw new Exception(`Unable to retreive users.`, err);
        }
    }

    async saveUser(emailAddress: string, roles: InstanceRole[], guid: string, firstName: string = null, lastName: string = null){
        try{
            let apiPath = `user/save?emailAddress=${emailAddress}&firstName=${firstName}&lastName=${lastName}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, roles);

            return resp.data as InstanceUser;
        } catch(err){
            throw new Exception(`Unable to retreive users.`, err);
        }
    }

    async deleteUser(userId: number, guid: string){
        try{
            let apiPath = `user/delete/${userId}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete the user for id: ${userId}`, err);
        }
    }
}