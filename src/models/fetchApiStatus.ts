/**
 * Represents the sync status of the Fetch API CDN for an instance.
 * Used to check if changes made via the Management API have propagated to the Fetch API CDNs.
 */
export interface FetchApiStatus {
    /** Record timestamp */
    timestamp?: string;
    
    /** When the sync completed */
    completionTime?: string;
    
    /** Error message if sync failed */
    errorMessage?: string;
    
    /** Indicates if a content sync is currently in progress */
    inProgress: boolean;
    
    /** Number of items affected by the sync */
    itemsAffected: number;
    
    /** Last content version ID synced */
    lastContentVersionID: number;
    
    /** Last deleted content version ID synced */
    lastDeletedContentVersionID: number;
    
    /** Last deleted page version ID synced */
    lastDeletedPageVersionID: number;
    
    /** Lease ID for the sync operation */
    leaseID?: string;
    
    /** Maximum change date processed */
    maxChangeDate?: string;
    
    /** Maximum content model date processed */
    maxContentModelDate?: string;
    
    /** Push type (1 = Preview, 2 = Fetch/Live) */
    pushType: number;
    
    /** When the sync started */
    startTime?: string;
    
    /** The website name */
    websiteName?: string;
}

/**
 * Sync mode for checking Fetch API status
 */
export type FetchApiSyncMode = 'fetch' | 'preview';
