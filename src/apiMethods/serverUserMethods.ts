import { Exception } from "../errors/exception";
import { Options } from "../types/options";
import { ServerUser } from "../types/serverUser";
import { ClientInstance } from "./clientInstance";

export class ServerUserMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async me(guid: string){
        try{
            let apiPath = `users/me`;
            const resp = await this._clientInstance.executeServerGet(apiPath, guid, this._options.token);

            return resp.data as ServerUser;
        } catch(err){
            throw new Exception('Unable to retrieve user information.');
        }
    }

    async you(guid: string, serverUserID: number){
        try{
            let apiPath = `users/you?srvUserID=${serverUserID}`
            const resp = await this._clientInstance.executeServerGet(apiPath, guid, this._options.token);

            return resp.data;
        } catch(err){
            throw new Exception('Unable to retrieve user information.');
        }
    }
}