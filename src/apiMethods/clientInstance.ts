import axios, { AxiosInstance } from 'axios';
import { Options } from "../models/options";

export class ClientInstance {

    _options: Options
    private _tokenRefreshHandler?: () => Promise<string | null>;

    constructor(options: Options) {
        this._options = options
    }

    /**
     * Set token refresh handler for automatic token refresh on 401 errors
     * @param handler - Function that returns a valid access token or null
     */
    setTokenRefreshHandler(handler: () => Promise<string | null>): void {
        this._tokenRefreshHandler = handler;
    }

    /**
     * Handle token refresh on 401 errors
     * @param error - The error from the API call
     * @param retryCallback - Function to retry the original request
     * @returns Promise with retry result or throws error
     */
    private async handleTokenRefresh(error: any, retryCallback: () => Promise<any>): Promise<any> {
        // Check if it's a 401 error and we have a refresh handler
        if (error.response?.status === 401 && this._tokenRefreshHandler) {
            try {
                const newToken = await this._tokenRefreshHandler();
                if (newToken) {
                    // Update the token in options
                    this._options.token = newToken;
                    // Retry the original request with new token
                    return await retryCallback();
                }
            } catch (refreshError) {
                // Token refresh failed, throw original error
                throw error;
            }
        }
        // Not a 401 or no refresh handler, throw original error
        throw error;
    }
    /**
     * Figure out the Base Url, which can be overriden using options.baseUrl
     *
     * @param {string} guid
     * @returns {string}
     * @memberof ClientInstance
     */
    determineBaseUrl(guid: string): string {

        //if we have a baseUrl overridden, use it
        if (this._options.baseUrl) return this._options.baseUrl

        var seperator = guid.split('-');

        //determine the base url based on the GUID
        if (seperator[1] === 'd') {
            return "https://mgmt-dev.aglty.io";
        }
        else if (seperator[1] === 'u') {
            return "https://mgmt.aglty.io";
        }
        else if (seperator[1] === 'c') {
            return "https://mgmt-ca.aglty.io";
        }
        else if (seperator[1] === 'e') {
            return "https://mgmt-eu.aglty.io";
        }
        else if (seperator[1] === 'a') {
            return "https://mgmt-aus.aglty.io";
        }

        return "https://mgmt.aglty.io";
    }

    /**
     * Determine OAuth base URL based on region or custom baseUrl
     * @param region - Optional region code (d, u, c, e, a) or use default
     * @returns OAuth base URL
     */
    determineOAuthBaseUrl(region?: string): string {
        // If we have a baseUrl override, use it
        if (this._options.baseUrl) return this._options.baseUrl;

        // Use provided region or default to production
        if (region === 'd') {
            return "https://mgmt-dev.aglty.io";
        }
        else if (region === 'u') {
            return "https://mgmt.aglty.io";
        }
        else if (region === 'c') {
            return "https://mgmt-ca.aglty.io";
        }
        else if (region === 'e') {
            return "https://mgmt-eu.aglty.io";
        }
        else if (region === 'a') {
            return "https://mgmt-aus.aglty.io";
        }

        return "https://mgmt.aglty.io";
    }

    getInstance(guid: string): AxiosInstance {
        let baseUrl = this.determineBaseUrl(guid);
        let instance = axios.create({
            baseURL: `${baseUrl}/api/v1/instance/${guid}`,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
        return instance;
    }

    getAxiosInstance(guid: string): AxiosInstance{
        let baseUrl = this.determineBaseUrl(guid);
        let instance = axios.create({
            baseURL: `${baseUrl}/api/v1`,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
        return instance;
    }

    /**
     * Get Axios instance for OAuth endpoints
     * @param region - Optional region code for OAuth endpoints
     * @returns Axios instance configured for OAuth endpoints
     */
    getOAuthInstance(region?: string): AxiosInstance {
        let baseUrl = this.determineOAuthBaseUrl(region);
        let instance = axios.create({
            baseURL: `${baseUrl}/oauth`,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        return instance;
    }

    async executeServerGet(apiPath: string, guid: string, token: string){
        let instance = this.getAxiosInstance(guid);
        
        const makeRequest = async () => {
            return await instance.get(apiPath, {
                headers: {
                    'Authorization': `Bearer ${this._options.token || token}`,
                    'Cache-Control': 'no-cache'
                }
            });
        };

        try {
            return await makeRequest();
        }
        catch (err) {
            return await this.handleTokenRefresh(err, makeRequest);
        }
    }

    async executeGet(apiPath: string, guid: string, token: string) {
        let instance = this.getInstance(guid);
        
        const makeRequest = async () => {
            return await instance.get(apiPath, {
                headers: {
                    'Authorization': `Bearer ${this._options.token || token}`,
                    'Cache-Control': 'no-cache'
                }
            });
        };

        try {
            return await makeRequest();
        }
        catch (err) {
            return await this.handleTokenRefresh(err, makeRequest);
        }
    }

    async executeDelete(apiPath: string, guid: string, token: string, data?: any) {
        let instance = this.getInstance(guid);
        
        const makeRequest = async () => {
            return await instance.delete(apiPath, {
                headers: {
                    'Authorization': `Bearer ${this._options.token || token}`,
                    'Cache-Control': 'no-cache'
                },
                data: data
            });
        };

        try {
            return await makeRequest();
        }
        catch (err) {
            return await this.handleTokenRefresh(err, makeRequest);
        }
    }

    async executePost(apiPath: string, guid: string, token: string, data: any) {
        let instance = this.getInstance(guid);
        
        const makeRequest = async () => {
            return await instance.post(apiPath, data, {
                headers: {
                    'Authorization': `Bearer ${this._options.token || token}`,
                    'Cache-Control': 'no-cache'
                }
            });
        };

        try {
            return await makeRequest();
        }
        catch (err) {
            return await this.handleTokenRefresh(err, makeRequest);
        }
    }

    /**
     * Execute OAuth GET request
     * @param apiPath - API path relative to /oauth
     * @param region - Optional region code
     * @param token - Optional bearer token for authenticated requests
     * @returns Promise with response
     */
    async executeOAuthGet(apiPath: string, region?: string, token?: string) {
        let instance = this.getOAuthInstance(region);
        try {
            const headers: any = {
                'Cache-Control': 'no-cache'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const resp = await instance.get(apiPath, { headers });
            return resp;
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Execute OAuth POST request
     * @param apiPath - API path relative to /oauth
     * @param data - Request body data
     * @param region - Optional region code
     * @param token - Optional bearer token for authenticated requests
     * @returns Promise with response
     */
    async executeOAuthPost(apiPath: string, data: any, region?: string, token?: string) {
        let instance = this.getOAuthInstance(region);
        try {
            const headers: any = {
                'Cache-Control': 'no-cache'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Set appropriate content type based on data type
            if (data instanceof URLSearchParams) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else if (typeof data === 'object' && data !== null) {
                headers['Content-Type'] = 'application/json';
            }

            const resp = await instance.post(apiPath, data, { headers });
            return resp;
        }
        catch (err) {
            throw err;
        }
    }
}