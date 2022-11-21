import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { InstanceUser } from "../models/instanceUser";
import { WebsiteUser } from "../models/websiteUser";
import { InstanceRole } from "../models/instanceRole";
export declare class InstanceUserMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    constructor(options: Options);
    getUsers(): Promise<WebsiteUser>;
    saveUser(emailAddress: string, roles: InstanceRole[], firstName?: string, lastName?: string): Promise<InstanceUser>;
    deleteUser(userId: number): Promise<string>;
}
