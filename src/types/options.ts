export interface Options {
    token: string;
    baseUrl?: string | null; // Made optional as it can be null
    refresh_token?: string; // Assumed optional
    duration?: number; // Default handled elsewhere?
    retryCount?: number; // Default handled elsewhere?
} 