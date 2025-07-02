import { BatchOperationType } from "../enums/batchOperationType";
import { BatchItemType } from "../enums/batchItemType";

/**
 * Request model for creating a new batch.
 */
export interface CreateBatchRequest {
    batchName?: string;
    operationType?: BatchOperationType;
    isPrivate?: boolean;
    comments?: string;
}

/**
 * Request model for adding an item to a batch.
 */
export interface AddBatchItemRequest {
    itemType: BatchItemType;
    itemID: number;
    languageCode: string;
    itemTitle?: string;
}

/**
 * Request model for processing a batch.
 */
export interface ProcessBatchRequest {
    operationType: BatchOperationType;
    comments?: string;
} 