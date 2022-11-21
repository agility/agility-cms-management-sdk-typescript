import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../models/batch";
import { BatchState } from "../enums/batchState.";

export class BatchMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
    }

    async getBatch(batchID: number){
        try{
            let apiPath = `batch/${batchID}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Batch;
        } catch(err){
            throw `Unable to retreive the batch for id: ${batchID}`;
        }
    }

      async Retry(method: Function) {
        let retryCount = this._options.retryCount;
        let duration = this._options.duration;
        if(retryCount <= 0)
            throw new Error('Number of retries has been exhausted.');
        while(true){
            try{
                let batch = await method() as Batch;
                if(batch.batchState === BatchState.Processed){
                    return batch;
                }
                else{
                    --retryCount;
                    if(--retryCount <= 0){
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