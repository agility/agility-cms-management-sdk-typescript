import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../models/batch";
import { BatchState } from "../enums/batchState.";
import { Exception } from "../models/exception";
import { BatchTypesResponse } from "../models/batchTypes";

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

    /**
     * Retrieves all batch-related enum types for developer discovery.
     * This method provides all available enum values with their names,
     * enabling dynamic UI population and client-side validation.
     * 
     * @param guid - Current website guid
     * @returns Promise containing all batch enum types
     * 
     * @example
     * ```typescript
     * // Get all batch types for UI population
     * const types = await client.batchMethods.getBatchTypes(guid);
     * 
     * // Create dropdown options for item types
     * const itemTypeOptions = types.itemTypes.map(type => ({
     *   label: type.name,
     *   value: type.value
     * }));
     * 
     * // Validate operation type
     * const isValidOperation = (value: number) => 
     *   types.workflowOperations.some(op => op.value === value);
     * ```
     */
    async getBatchTypes(guid: string): Promise<BatchTypesResponse> {
        try {
            let apiPath = `batch/types`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as BatchTypesResponse;
        } catch (err) {
            throw new Exception(`Unable to retrieve batch types`, err);
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