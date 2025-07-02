/**
 * Workflow operation types specifically for batch processing.
 * Subset of BatchOperationType containing only workflow-related operations.
 */
export enum WorkflowOperationType {
    /**
     * Publish the items in the batch.
     */
    Publish = 1,
    
    /**
     * Unpublish the items in the batch.
     */
    Unpublish = 2,
    
    /**
     * Approve the items in the batch.
     */
    Approve = 3,
    
    /**
     * Decline the items in the batch.
     */
    Decline = 4,
    
    /**
     * Request approval for the items in the batch.
     */
    RequestApproval = 5
} 