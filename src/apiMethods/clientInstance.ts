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
             console.error("Fetch error:", err);
             throw err;
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
             console.error("Fetch error:", err);
             throw err;
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
                 throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData}`);
             }
             // DELETE might return no content or some confirmation
             // If no content is expected, you might return resp.ok or resp.status
             // If JSON confirmation is expected: return await resp.json();
             return resp; // Or process response as needed
        }
        catch (err) {
             console.error("Fetch error:", err);
             throw err;
        }
    }

    async executePost(apiPath: string, guid: string, token: string, data: any) {
        const baseUrl = this.getBaseUrlForInstance(guid);
        const url = `${baseUrl}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json' // Assuming JSON data is sent
                },
                body: JSON.stringify(data) // Stringify the data for the body
            });

            if (!resp.ok) {
                const errorData = await resp.text();
                throw new Error(`HTTP error! status: ${resp.status}, message: ${errorData}`);
            }
             return await resp.json(); // Assuming JSON response
        }
        catch (err) {
             console.error("Fetch error:", err);
             throw err;
        }
    }
}