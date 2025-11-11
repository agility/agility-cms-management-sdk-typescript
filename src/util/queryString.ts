/**
 * Builds a query string from an object of parameters.
 * Only includes parameters that have actual values (skips undefined, null, and empty strings).
 * 
 * @param params - Object containing key-value pairs for query parameters
 * @returns Query string starting with '?' if parameters exist, empty string otherwise
 */
export function buildQueryString(params: Record<string, any>): string {
    const queryParams: string[] = [];
    
    for (const [key, value] of Object.entries(params)) {
        // Skip undefined and null values
        if (value === undefined || value === null) {
            continue;
        }
        
        // Skip empty strings
        if (typeof value === 'string' && value === '') {
            continue;
        }
        
        // Include all other values (numbers including 0, booleans including false, non-empty strings)
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
    
    return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
}

