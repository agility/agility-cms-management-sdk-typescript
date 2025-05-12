import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { InstanceUser } from "../types/instanceUser";
import { WebsiteUser } from "../types/websiteUser";
import { InstanceRole } from "../types/instanceRole";
import { Exception } from "../errors/exception";

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
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retreive users.`, innerError);
        }
    }

    async saveUser(emailAddress: string, roles: InstanceRole[], guid: string, firstName: string | null = null, lastName: string | null = null){
        try{
            let apiPath = `user/save?emailAddress=${emailAddress}&firstName=${firstName ?? ''}&lastName=${lastName ?? ''}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, roles);

            return resp.data as InstanceUser;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to save user.`, innerError);
        }
    }

    async deleteUser(userId: number, guid: string){
        try{
            let apiPath = `user/delete/${userId}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(`API error deleting user! status: ${resp.status}, message: ${errorText}`);
            }
            return await resp.text();
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to delete the user for id: ${userId}`, innerError);
        }
    }

}