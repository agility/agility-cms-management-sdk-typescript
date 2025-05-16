import { Options } from "../types/options";

export class ClientInstance {

    _options: Options

    constructor(options: Options) {
        this._options = options
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

    private getBaseUrlForInstance(guid: string): string {
        let baseUrl = this.determineBaseUrl(guid);
        return `${baseUrl}/api/v1/instance/${guid}`;
    }

    private getBaseUrlForAxios(guid: string): string {
        let baseUrl = this.determineBaseUrl(guid);
        return `${baseUrl}/api/v1`;
    }


    async executeServerGet(apiPath: string, guid: string, token: string){
        const baseUrl = this.getBaseUrlForAxios(guid);
        const url = `${baseUrl}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

        try {
            const resp = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json' // Assuming JSON response, adjust if needed
                }
            });

            if (!resp.ok) {
                // Throw an error or handle non-OK responses appropriately
                const errorData = await resp.text(); // or resp.json() if error is JSON
                throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData}`);
            }
            // Assuming JSON response, adjust based on actual API response type
             return await resp.json();
        }
        catch (err) {
            // Rethrow or handle fetch-specific errors (e.g., network issues)
             const errorMessage = err instanceof Error ? err.message : String(err);
             console.error("Fetch error in executeServerGet:", errorMessage);
             // Throw a new, simple error object
             throw new Error(`Fetch failed: ${errorMessage}`);
        }
    }

    async executeGet(apiPath: string, guid: string, token: string) {
        const baseUrl = this.getBaseUrlForInstance(guid);
        const url = `${baseUrl}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

        try {
            const resp = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                }
            });

            if (!resp.ok) {
                const errorData = await resp.text();
                throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData}`);
            }
             return await resp.json();
        }
        catch (err) {
             const errorMessage = err instanceof Error ? err.message : String(err);
             console.error("Fetch error in executeGet:", errorMessage);
             // Throw a new, simple error object
             throw new Error(`Fetch failed: ${errorMessage}`);
        }

    }

    async executeDelete(apiPath: string, guid: string, token: string) {
        const baseUrl = this.getBaseUrlForInstance(guid);
        const url = `${baseUrl}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

        try {
            const resp = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });

             if (!resp.ok) {
                 const errorData = await resp.text();
                 // Try to parse as JSON for more detailed error, fallback to text
                 let detail = errorData;
                 try {
                    const errJson = JSON.parse(errorData);
                    detail = errJson.message || errJson.title || JSON.stringify(errJson);
                 } catch (e) { /* ignore parsing error */ }
                 throw new Error(`HTTP error! status: ${resp.status}, message: ${detail}`);
             }
             
             // If response is 204 No Content, body might be empty
             if (resp.status === 204) {
                return { message: "Operation successful (No Content)" }; // Or an empty object / status
             }

             // For other success statuses (e.g. 200 OK, 202 Accepted), try to parse JSON
             try {
                return await resp.json(); 
             } catch (e) {
                // If JSON parsing fails but status is OK, could be plain text or unexpected
                return { message: "Operation successful, but response was not JSON." };
             }
        }
        catch (err) {
             const errorMessage = err instanceof Error ? err.message : String(err);
             console.error("Fetch error in executeDelete:", errorMessage);
             // Throw a new, simple error object
             throw new Error(`Fetch failed: ${errorMessage}`);
        }
    }

    async executePost(apiPath: string, guid: string, token: string, data: any) {
        const baseUrl = this.getBaseUrlForInstance(guid);
        const url = `${baseUrl}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

        try {
            let headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache',
            };
            let body: BodyInit;

            if (data instanceof FormData) {
                // Don't set Content-Type for FormData, fetch/browser will do it with correct boundary
                body = data;
            } else {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(data);
            }

            const resp = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body
            });

            if (!resp.ok) {
                const errorData = await resp.text();
                throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData}`);
            }
             return await resp.json(); // Assuming JSON response
        }
        catch (err) {
             const errorMessage = err instanceof Error ? err.message : String(err);
             console.error("Fetch error in executePost:", errorMessage);
             // Throw a new, simple error object
             throw new Error(`Fetch failed: ${errorMessage}`);
        }
    }
}