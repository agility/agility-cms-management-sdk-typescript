import { BatchState } from "../enums/batchState."
import { BatchOperationType } from "../enums/batchOperationType";
import { BatchItem } from "./batchItem";

export class Batch {
    batchID: number | null;
    batchItemID: number | null;
    batchName: string;
    batchState: BatchState;
    operationType: BatchOperationType;
    ownerUserID: number | null;
    createdDate: string;
    modifiedDate: string;
    processDate: string | null;
    queueDate: string | null;
    isPrivate: boolean;
    modifiedByUserID: number;
    queuedByUserID: number | null;
    ownerName: string;
    modifiedByName: string;
    queuedByName: string;
    additionalData: string;
    errorData: string;
    percentComplete: number | null;
    numItemsProcessed: number | null;
    abortYN: boolean | null;
    statusMessage: string;
    batchItemCount: number;
    items: BatchItem[];
}