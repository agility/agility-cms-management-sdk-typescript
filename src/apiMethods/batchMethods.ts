import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../models/batch";
import { BatchState } from "../enums/batchState.";
import { Exception } from "../models/exception";
import { CreateBatchRequest, AddBatchItemRequest, ProcessBatchRequest } from "../models/batchRequests";

export class BatchMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getBatch(batchID: number, guid: string, expandItems: boolean = true): Promise<Batch> {
        try {
            let apiPath = `batch/${batchID}?expandItems=${expandItems}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Batch;
        } catch (err) {
            throw new Exception(`Unable to retrieve the batch for id: ${batchID}`, err);
        }
    }

    async publishBatch(batchID: number, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/publish`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to publish the batch with id: ${batchID}`, err);
        }
    }

    async unpublishBatch(batchID: number, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/unpublish`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to unpublish the batch with id: ${batchID}`, err);
        }
    }

    async approveBatch(batchID: number, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/approve`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to approve the batch with id: ${batchID}`, err);
        }
    }

    async declineBatch(batchID: number, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/decline`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to decline the batch with id: ${batchID}`, err);
        }
    }

    async requestApprovalBatch(batchID: number, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/request-approval`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to request approval for the batch with id: ${batchID}`, err);
        }
    }

    async createBatch(request: CreateBatchRequest, guid: string): Promise<number> {
        try {
            let apiPath = `batch`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, request);

            return resp.data as number;
        } catch (err) {
            throw new Exception(`Unable to create batch`, err);
        }
    }

    async addItemToBatch(batchID: number, request: AddBatchItemRequest, guid: string): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/items`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, request);

            return resp.data as number;
        } catch (err) {
            throw new Exception(`Unable to add item to batch with id: ${batchID}`, err);
        }
    }

    async removeItemFromBatch(batchID: number, itemId: number, guid: string): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/items/${itemId}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as number;
        } catch (err) {
            throw new Exception(`Unable to remove item ${itemId} from batch with id: ${batchID}`, err);
        }
    }

    async processBatch(batchID: number, request: ProcessBatchRequest, guid: string, returnBatchId: boolean = false): Promise<number> {
        try {
            let apiPath = `batch/${batchID}/process`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, request);

            let resultBatchID = resp.data as number;
            
            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return resultBatchID;
            }

            // Default behavior: wait for completion and return batch ID
            await this.Retry(async () => await this.getBatch(resultBatchID, guid));
            return resultBatchID;
        } catch (err) {
            throw new Exception(`Unable to process the batch with id: ${batchID}`, err);
        }
    }

    async Retry(method: Function) {
        let retryCount = this._options.retryCount;
        let duration = this._options.duration;
        if (retryCount <= 0)
            throw new Error('Number of retries has been exhausted.');
        while (true) {
            try {
                let batch = await method() as Batch;
                if (batch.batchState === BatchState.Processed) {
                    return batch;
                }
                else {
                    --retryCount;
                    if (--retryCount <= 0) {
                        throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
                    }
                    await this.delay(duration);
                }
            } catch (err) {
                throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
            }
        }
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}