export interface TokenResponseData {
    partitionKey: string;
    rowKey: string;
    access_token: string;
    refresh_token: string;
    token_type?: string;
    expires_in?: number;
    timestamp?: Date; // Added by Azure Table Storage automatically
    // Azure Table Storage might add an 'etag' property, declare it if needed for updates
    etag?: string;
} 