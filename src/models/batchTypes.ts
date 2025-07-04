/**
 * Response model containing all batch-related enum types for developer discovery.
 */
export interface BatchTypesResponse {
    /**
     * Available item types that can be added to batches.
     */
    itemTypes: EnumInfo[];
    
    /**
     * All available batch operation types (includes workflow and other operations).
     */
    operationTypes: EnumInfo[];
    
    /**
     * Workflow-specific operation types (subset of operationTypes).
     */
    workflowOperations: EnumInfo[];
    
    /**
     * Available batch states during lifecycle.
     */
    states: EnumInfo[];
}

/**
 * Information about an enum value including value and name.
 */
export interface EnumInfo {
    /**
     * The numeric value of the enum.
     */
    value: number;
    
    /**
     * The string name of the enum value (e.g., "ContentItem", "Publish").
     */
    name: string;
} 