import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Container } from "../types/container";
import { Notification } from "../types/notification";
import { Exception } from "../errors/exception";
import { BatchMethods } from "./batchMethods";
import { Batch } from "../types/batch";
// import { DeleteResponse } from "../types/apiResponse";

export class ContainerMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    private batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this.batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves a specific container by its numeric ID.
     * @param id The container ID.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Container object.
     */
    async getContainerByID(id: number, guid: string): Promise<Container> {
        try{
            let apiPath = `container/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            console.log('resp');
            console.log(resp);
            if (!resp?.containerID) { throw new Error("Invalid response structure for Container."); }
            return resp as Container;
        } catch(err: any){
            throw new Exception(`Unable to retrieve the container for id: ${id}`, err as Error);
        }
    }

    /**
     * Retrieves all containers associated with a specific content model ID.
     * @param modelId The content model ID.
     * @param guid The instance GUID.
     * @returns A promise resolving to an array of Container objects.
     */
    async getContainersByModel(modelId: number, guid: string): Promise<Container[]> {
        try{
            let apiPath = `container/model/${modelId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Container list."); }
            return resp as Container[];
        } catch(err: any){
            throw new Exception(`Unable to retrieve the containers for model id: ${modelId}`, err as Error);
        }
    }

    /**
     * Retrieves a specific container by its reference name.
     * @param referenceName The container reference name.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Container object.
     */
    async getContainerByReferenceName(referenceName: string, guid: string): Promise<Container> {
        try{
            let apiPath = `container/${referenceName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.containerID) { throw new Error("Invalid response structure for Container."); }
            return resp as Container;
        } catch(err: any){
            throw new Exception(`Unable to retrieve the container for referenceName: ${referenceName}`, err as Error);
        }
    }

    /**
     * Retrieves security information for a specific container.
     * @param id The container ID.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Container object (or a specific security type if defined).
     */
    async getContainerSecurity(id: number, guid: string): Promise<Container> {
        try{
            let apiPath = `container/${id}/security`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp as Container;
        } catch(err: any){
            throw new Exception(`Unable to retrieve the container security for id: ${id}`, err as Error);
        }
    }

    /**
     * Retrieves a list of all containers in the instance.
     * @param guid The instance GUID.
     * @returns A promise resolving to an array of Container objects.
     */
    async getContainerList(guid: string): Promise<Container[]> {
        try{
            let apiPath = `container/list`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Container list."); }
            return resp as Container[];
        } catch(err: any){
            throw new Exception(`Unable to retrieve the container list`, err as Error);
        }
    }

    /**
     * Retrieves the list of notifications for a specific container.
     * @param id The container ID.
     * @param guid The instance GUID.
     * @returns A promise resolving to an array of Notification objects.
     */
    async getNotificationList(id: number, guid: string): Promise<Notification[]> {
        try{
            let apiPath = `container/${id}/notifications`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Notification list."); }
            return resp as Notification[];
        } catch(err: any){
            throw new Exception(`Unable to retrieve the notifications for container id: ${id}`, err as Error);
        }
    }

    /**
     * Saves (creates or updates) a container. Assumes this is a batch operation.
     * @param container The container object to save.
     * @param guid The instance GUID.
     * @param forceReferenceName Optional flag to force reference name.
     * @returns A promise resolving to the final Batch object after the operation completes.
     */
    async saveContainer(container: Container, guid: string, forceReferenceName: boolean = false): Promise<Batch> {
        try{
            let apiPath = `container${forceReferenceName ? '?forceReferenceName=true' : ''}`;
            const initialResp = await this._clientInstance.executePost(apiPath, guid, this._options.token, container);
            
            if (!initialResp?.batchID && initialResp?.batchID !== 0) {
                 throw new Error('Save container did not return a valid batch ID.');
            }
            const initialBatch = initialResp as Batch;
            
            if (typeof initialBatch.batchID !== 'number') {
                throw new Error('Batch ID from save container is not a number.');
            }
            
            return await this.batchMethods.Retry(async () => this.batchMethods.getBatch(initialBatch.batchID!, guid));
        } catch (err: any) {
             const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to save the container`, error);
        }
    }

    /**
     * Deletes a container. Assumes this is a batch operation.
     * @param id The ID of the container to delete.
     * @param guid The instance GUID.
     * @returns A promise resolving to the final Batch object after the deletion completes.
     */
    async deleteContainer(id: number, guid: string): Promise<Batch> {
        try{
            let apiPath = `container/${id}`;
            const initialResp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
            
            if (!initialResp?.batchID && initialResp?.batchID !== 0) {
                 throw new Error('Delete container did not return a valid batch ID.');
            }
            const initialBatch = initialResp as Batch;
            
            if (typeof initialBatch.batchID !== 'number') {
                throw new Error('Batch ID from delete container is not a number.');
            }

            return await this.batchMethods.Retry(async () => this.batchMethods.getBatch(initialBatch.batchID!, guid));
        } catch (err: any) {
             const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete the container for id: ${id}`, error);
        }
    }
}