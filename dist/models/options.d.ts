export declare class Options {
    locale: string | null;
    token: string | null;
    baseUrl: string | null;
    guid: string;
    refresh_token: string | null;
    duration: number | 3000;
    retryCount: number | 500;
    determineBaseUrl(guid: string): string;
}
