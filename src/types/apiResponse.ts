/**
 * Represents a generic success or informational message returned by the API.
 */
export interface ApiResponseMessage {
    message: string;
}

/**
 * Represents the typical response structure for DELETE operations, often empty or just a status.
 * For simplicity, we can often expect an empty object or potentially a simple message.
 */
export interface DeleteResponse { 
    // DELETE responses might be empty, add optional fields if needed based on API spec
    message?: string; 
} 