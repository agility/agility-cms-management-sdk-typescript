import { BatchState } from "../enums/batchState"; // Corrected path if enums are in src/enums
import { BatchOperationType } from "../enums/batchOperationType"; // Corrected path if enums are in src/enums
import { BatchItem } from "./batchItem";

export interface Batch {
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