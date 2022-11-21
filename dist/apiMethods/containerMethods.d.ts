import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Container } from "../models/container";
import { Notification } from "../models/notification";
export declare class ContainerMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    constructor(options: Options);
    getContainerByID(id: number): Promise<Container>;
    getContainerByReferenceName(referenceName: string): Promise<Container>;
    getContainerSecurity(id: number): Promise<Container>;
    getContainerList(): Promise<Container[]>;
    getNotificationList(id: number): Promise<Notification[]>;
    saveContainer(container: Container): Promise<Container>;
    deleteContainer(id: number): Promise<string>;
}
