import * as keytar from 'keytar';

export interface StoredTokenData {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number; // Unix timestamp
    tokenType?: string;
    scope?: string;
}

export interface TokenStorageOptions {
    serviceName?: string;
    accountName?: string;
    fallbackToMemory?: boolean;
}

/**
 * Secure token storage using OS-level keychain/credential store
 * Falls back to in-memory storage if keytar is unavailable
 */
export class TokenStorage {
    private serviceName: string;
    private accountName: string;
    private fallbackToMemory: boolean;
    private memoryStorage: Map<string, StoredTokenData> = new Map();
    private keytarAvailable: boolean = true;

    constructor(options: TokenStorageOptions = {}) {
        this.serviceName = options.serviceName || 'agility-cms-management-sdk';
        this.accountName = options.accountName || 'default';
        this.fallbackToMemory = options.fallbackToMemory !== false;
        
        // Test keytar availability
        this.testKeytarAvailability();
    }

    /**
     * Test if keytar is available on this platform
     */
    private async testKeytarAvailability(): Promise<void> {
        try {
            // Test keytar by trying to access it
            await keytar.findCredentials(this.serviceName + '-test');
            this.keytarAvailable = true;
        } catch (error) {
            console.warn('Keytar not available, falling back to memory storage:', error);
            this.keytarAvailable = false;
        }
    }

    /**
     * Store token data securely
     */
    async setTokens(tokenData: StoredTokenData): Promise<void> {
        const serializedData = JSON.stringify(tokenData);
        
        if (this.keytarAvailable) {
            try {
                await keytar.setPassword(this.serviceName, this.accountName, serializedData);
                return;
            } catch (error) {
                console.warn('Failed to store tokens in keytar:', error);
                if (!this.fallbackToMemory) {
                    throw error;
                }
            }
        }
        
        // Fallback to memory storage
        this.memoryStorage.set(this.accountName, tokenData);
    }

    /**
     * Retrieve token data
     */
    async getTokens(): Promise<StoredTokenData | null> {
        if (this.keytarAvailable) {
            try {
                const serializedData = await keytar.getPassword(this.serviceName, this.accountName);
                if (serializedData) {
                    return JSON.parse(serializedData);
                }
            } catch (error) {
                console.warn('Failed to retrieve tokens from keytar:', error);
                if (!this.fallbackToMemory) {
                    return null;
                }
            }
        }
        
        // Fallback to memory storage
        return this.memoryStorage.get(this.accountName) || null;
    }

    /**
     * Check if stored tokens are expired
     */
    async areTokensExpired(): Promise<boolean> {
        const tokenData = await this.getTokens();
        if (!tokenData || !tokenData.expiresAt) {
            return true; // No tokens or no expiration info = expired
        }
        
        const now = Date.now();
        const bufferTime = 60 * 1000; // 1 minute buffer
        return now >= (tokenData.expiresAt - bufferTime);
    }

    /**
     * Get access token if not expired
     */
    async getValidAccessToken(): Promise<string | null> {
        const tokenData = await this.getTokens();
        if (!tokenData) {
            return null;
        }
        
        const isExpired = await this.areTokensExpired();
        if (isExpired) {
            return null;
        }
        
        return tokenData.accessToken;
    }

    /**
     * Get refresh token
     */
    async getRefreshToken(): Promise<string | null> {
        const tokenData = await this.getTokens();
        return tokenData?.refreshToken || null;
    }

    /**
     * Update only the access token (keeping refresh token)
     */
    async updateAccessToken(accessToken: string, expiresIn?: number): Promise<void> {
        const existingData = await this.getTokens();
        const tokenData: StoredTokenData = {
            ...existingData,
            accessToken,
            expiresAt: expiresIn ? Date.now() + (expiresIn * 1000) : undefined
        };
        
        await this.setTokens(tokenData);
    }

    /**
     * Clear all stored tokens
     */
    async clearTokens(): Promise<void> {
        if (this.keytarAvailable) {
            try {
                await keytar.deletePassword(this.serviceName, this.accountName);
            } catch (error) {
                console.warn('Failed to clear tokens from keytar:', error);
            }
        }
        
        // Also clear memory storage
        this.memoryStorage.delete(this.accountName);
    }

    /**
     * Check if tokens exist (regardless of expiration)
     */
    async hasTokens(): Promise<boolean> {
        const tokenData = await this.getTokens();
        return tokenData !== null && !!tokenData.accessToken;
    }

    /**
     * Get token expiration time
     */
    async getTokenExpiration(): Promise<number | null> {
        const tokenData = await this.getTokens();
        return tokenData?.expiresAt || null;
    }

    /**
     * Calculate time until expiration in seconds
     */
    async getTimeUntilExpiration(): Promise<number> {
        const expiresAt = await this.getTokenExpiration();
        if (!expiresAt) {
            return 0;
        }
        
        const now = Date.now();
        const timeUntilExpiration = Math.max(0, expiresAt - now);
        return Math.floor(timeUntilExpiration / 1000);
    }

    /**
     * Get storage type being used
     */
    getStorageType(): 'keytar' | 'memory' {
        return this.keytarAvailable ? 'keytar' : 'memory';
    }
} 