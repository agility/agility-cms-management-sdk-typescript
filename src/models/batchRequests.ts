import { BatchOperationType } from "../enums/batchOperationType";
import { BatchItemType } from "../enums/batchItemType";

/**
 * Request model for creating a new batch.
 */
export interface CreateBatchRequest {
    /**
     * Custom name for the batch. If not provided, defaults to "Custom Batch".
     */
    batchName?: string;
    
    /**
     * Default operation type for the batch.
     * If not provided, defaults to Publish (1).
     */
    operationType?: BatchOperationType;
    
    /**
     * Whether the batch should be private (visible only to the creator).
     * If not provided, defaults to true.
     */
    isPrivate?: boolean;
    
    /**
     * Optional comments or notes about the batch.
     */
    comments?: string;
}

/**
 * Request model for adding a reference to an existing item to a batch.
 */
export interface AddBatchItemRequest {
    /**
     * The type of item to add to the batch.
     */
    itemType: BatchItemType;
    
    /**
     * The ID of the existing item to add to the batch.
     * For Content Items: use the ContentID of an existing content item
     * For Page Items: use the PageID of an existing page
     */
    itemID: number;
    
    /**
     * The language code for the item (e.g., "en-us", "fr-ca", "es-mx").
     */
    languageCode: string;
    
    /**
     * Optional display title for the item in the batch for identification purposes.
     */
    itemTitle?: string;
}

/**
 * Request model for adding multiple items to a batch at once.
 */
export interface AddBatchItemsRequest {
    /**
     * Array of items to add to the batch.
     * Each item must reference an existing content item or page in your CMS.
     */
    items: AddBatchItemRequest[];
}

/**
 * Request model for processing a batch with optional comments.
 */
export interface ProcessBatchRequest {
    /**
     * Optional comments for the batch operation (for audit trail).
     */
    comments?: string;
}



 