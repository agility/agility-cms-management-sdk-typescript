import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Container } from "../models/container";
import { Notification } from "../models/notification";
import { Exception } from "../models/exception";

export class ContainerMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getContainerByID(id: number, guid: string) {
        try {
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch (err) {
            throw new Exception(`Unable to retrieve the container for id: ${id}`, err);
        }
    }

    async getContainersByModel(modelId: number, guid: string) {
        try {
            let apiPath = `container/model/${modelId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch (err) {
            throw new Exception(`Unable to retrieve the containers for id: ${modelId}`, err);
        }
    }

    /**
     * Retrieves a container by its reference name.
     * Returns the container if found, or null if the container does not exist (404 error).
     * @param referenceName - The reference name of the container.
     * @param guid - The GUID for authentication.
     * @returns The container or null if not found.
     */
    async getContainerByReferenceName(referenceName: string, guid: string): Promise<Container | null> {
        try {
            let apiPath = `container/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch (err) {
            if (err.response?.status === 404) {
                return null; // If the container is not found, return null
            }
            throw new Exception(`Unable to retrieve the container for referenceName: ${referenceName}`, err);
        }
    }

    async getContainerSecurity(id: number, guid: string) {
        try {
            let apiPath = `container/${id}/security`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container;
        } catch (err) {
            throw new Exception(`Unable to retrieve the container for id: ${id}`, err);
        }
    }

    async getContainerList(guid: string) {
        try {
            let apiPath = `container/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Container[];
        } catch (err) {
            throw new Exception(`Unable to retrieve the container list`, err);
        }
    }

    async getNotificationList(id: number, guid: string) {
        try {
            let apiPath = `container/${id}/notifications`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Notification[];
        } catch (err) {
            throw new Exception(`Unable to retrieve the notifications for container id: ${id}`, err);
        }
    }

    async saveContainer(container: Container, guid: string, forceReferenceName: boolean = false) {
        try {
            let apiPath = `container${forceReferenceName ? '?forceReferenceName=true' : ''}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, container);

            return resp.data as Container;
        } catch (err) {
            throw new Exception(`Unable to save the container`, err);
        }
    }

    async deleteContainer(id: number, guid: string) {
        try {
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch (err) {
            throw new Exception(`Unable to delete the container for id: ${id}`, err);
        }
    }
}