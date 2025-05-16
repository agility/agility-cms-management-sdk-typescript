import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../types/batch";
import { BatchState } from "../enums/batchState";
import { Exception } from "../errors/exception";

export class BatchMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Retrieves the status and details of a specific batch operation.
     * @param batchID The numeric ID of the batch.
     * @param guid The instance GUID.
     * @returns A promise that resolves to the Batch object.
     * @throws {Exception} Throws an exception if the batch cannot be retrieved.
     */
    async getBatch(batchID: number, guid: string): Promise<Batch> {
        try {
            let apiPath = `batch/${batchID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            
            // Add basic validation if needed, e.g., check if resp.data exists and has expected properties
            if (!resp?.data?.batchID) { 
                throw new Error('Invalid API response for batch');
            }

            // Return the data directly
            return resp.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception("Unable to get batch status.", error);
        }
    }

    /**
     * Internal helper method to retry an operation that returns a Batch status until it's processed/deleted or timeout occurs.
     * @param method The async function to retry, which should return a Promise<Batch>.
     * @returns A promise that resolves to the final Batch object after successful completion or retries are exhausted.
     * @throws Throws an error if retries are exhausted or an unexpected error occurs during the retry loop.
     */
    async Retry(method: () => Promise<Batch>): Promise<Batch> {
        let retryCount = this._options.retryCount ?? 500;
        let duration = this._options.duration ?? 3000;
        if (retryCount <= 0) {
            throw new Error('Initial retry count must be positive.');
        }
        
        while (true) {
            try {
                let batch = await method();
                
                if (batch.batchState === BatchState.Processed ||
                    batch.batchState === BatchState.Deleted) {
                    return batch;
                }

                --retryCount;
                if (retryCount <= 0) {
                    throw new Error(`Timeout exceeded after ${this._options.retryCount ?? 500} retries. Operation (BatchID: ${batch.batchID}) still in state: ${batch.batchState}. Please check the Batches page in Agility.`);
                }
                
                await this.delay(duration);

            } catch (err) {
                console.error("Error during Retry loop:", err);
                throw new Error(`Retry mechanism failed. Last error: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
    }

    /**
     * Internal helper to pause execution.
     * @param ms Milliseconds to delay.
     * @returns A promise that resolves after the specified delay.
     */
    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}