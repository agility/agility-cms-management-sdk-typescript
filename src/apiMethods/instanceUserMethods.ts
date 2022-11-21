import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { InstanceUser } from "../models/instanceUser";
import { WebsiteUser } from "../models/websiteUser";
import { InstanceRole } from "../models/instanceRole";

export class InstanceUserMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
    }

    async getUsers(){
        try{
            let apiPath = `user/list`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as WebsiteUser;
        } catch(err){
            throw `Unable to retreive users.`;
        }
    }

    async saveUser(emailAddress: string, roles: InstanceRole[], firstName: string = null, lastName: string = null){
        try{
            let apiPath = `user/save?emailAddress=${emailAddress}&firstName=${firstName}&lastName=${lastName}`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, roles);

            return resp.data as InstanceUser;
        } catch(err){
            throw `Unable to retreive users.`;
        }
    }

    async deleteUser(userId: number){
        try{
            let apiPath = `user/delete/${userId}`;
            const resp = await this._clientInstance.executeDelete(apiPath, this._options);

            return resp.data as string;
        } catch(err){
            throw `Unable to delete the user for id: ${userId}`;
        }
    }
}