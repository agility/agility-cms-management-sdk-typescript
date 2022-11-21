import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { Batch } from "../models/batch";
export declare class BatchMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    constructor(options: Options);
    getBatch(batchID: number): Promise<Batch>;
    Retry(method: Function): Promise<Batch>;
    delay(ms: number): Promise<unknown>;
}
