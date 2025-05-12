import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../types/batch";
import { BatchState } from "../enums/batchState";
import { Exception } from "../errors/exception";

export class BatchMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async getBatch(batchID: number, guid: string){
        try{
            let apiPath = `batch/${batchID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Batch;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception("Unable to get batch status.", innerError);
        }
    }

      async Retry(method: Function) {
        let retryCount = this._options.retryCount ?? 500;
        let duration = this._options.duration ?? 3000;
        if(retryCount <= 0)
            throw new Error('Number of retries has been exhausted.');
        while(true){
            try{
                let batch = await method() as Batch;
                if(batch.batchState === BatchState.Processed ||
                   batch.batchState === BatchState.Deleted ||
                   retryCount <= 0){
                    return batch;
                }
                else{
                    --retryCount;
                    if(retryCount <= 0){
                        throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
                    }
                    await this.delay(duration);
                }
            } catch(err){
                throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
            }
        }
      }

     async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}