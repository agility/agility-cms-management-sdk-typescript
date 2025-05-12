export class TokenResponseData {
    partitionKey: string;
    rowKey: string;
    access_token: string = '';
    refresh_token: string = '';
    token_type?: string; // Optional based on typical OAuth responses
    expires_in?: number; // Optional
    timestamp?: Date; // Added by Azure Table Storage automatically
    // Azure Table Storage might add an 'etag' property, declare it if needed for updates
    etag?: string;

    constructor(partitionKey: string, rowKey: string) {
        this.partitionKey = partitionKey;
        this.rowKey = rowKey;
    }
} 