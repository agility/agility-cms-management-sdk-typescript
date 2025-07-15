import { Options } from "../models/options";
import { ClientInstance } from "../apiMethods/clientInstance";
import { Exception } from "../models/exception";
import { 
    OAuthTokenResponse, 
    AuthUrlOptions, 
    TokenExchangeRequest, 
    TokenRefreshRequest, 
    TokenValidationResponse,
    OAuthErrorResponse,
    TokenManagerConfig,
    AuthState
} from "../models/authTokens";
import { TokenStorage, StoredTokenData } from "../tokenStorage";

/**
 * Internal authentication methods - not exposed publicly
 * Handles OAuth flow and token management with secure storage
 */
export class AuthMethods {
    private _options: Options;
    private _clientInstance: ClientInstance;
    private _tokenStorage: TokenStorage;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this._tokenStorage = new TokenStorage();
    }

    /**
     * Generate OAuth authorization URL for user authentication
     * @param options - Authorization URL configuration options
     * @returns Complete authorization URL for user redirection
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * const authUrl = client.authMethods.generateAuthUrl({
     *     redirectUri: 'https://yourapp.com/auth/callback',
     *     scope: 'openid profile email offline_access',
     *     state: 'random-state-string'
     * });
     * 
     * // Redirect user to authorization URL
     * window.location.href = authUrl;
     * ```
     */
    generateAuthUrl(options: AuthUrlOptions): string {
        const baseUrl = this._clientInstance.determineOAuthBaseUrl(options.region);
        const authUrl = `${baseUrl}/oauth/authorize`;
        
        const params = new URLSearchParams({
            response_type: options.responseType || 'code',
            redirect_uri: options.redirectUri,
            scope: options.scope || 'openid profile email offline_access'
        });

        if (options.state) {
            params.append('state', options.state);
        }

        return `${authUrl}?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access tokens
     * Automatically stores tokens securely and sets them in Options
     * @param request - Token exchange request parameters
     * @returns Promise containing access and refresh tokens
     */
    async exchangeCodeForToken(request: TokenExchangeRequest, region?: string): Promise<OAuthTokenResponse> {
        try {
            const data = new URLSearchParams({
                grant_type: request.grantType || 'authorization_code',
                code: request.code,
                redirect_uri: request.redirectUri
            });

            const resp = await this._clientInstance.executeOAuthPost('token', data, region);
            const tokenResponse = resp.data as OAuthTokenResponse;
            
            // Store tokens securely with expiration
            const tokenData: StoredTokenData = {
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: tokenResponse.expires_in ? Date.now() + (tokenResponse.expires_in * 1000) : undefined,
                tokenType: tokenResponse.token_type,
                scope: tokenResponse.scope
            };
            
            await this._tokenStorage.setTokens(tokenData);
            
            // Set token in shared options for immediate use
            this._options.token = tokenResponse.access_token;
            
            return tokenResponse;
        } catch (err) {
            if (err.response?.data) {
                const errorData = err.response.data as OAuthErrorResponse;
                throw new Exception(`OAuth token exchange failed: ${errorData.error} - ${errorData.error_description || 'Unknown error'}`, err);
            }
            throw new Exception('Unable to exchange authorization code for token', err);
        }
    }

    /**
     * Refresh an expired access token using refresh token
     * Automatically updates stored tokens and Options
     * @param request - Token refresh request parameters
     * @returns Promise containing new access token
     */
    async refreshAccessToken(request: TokenRefreshRequest, region?: string): Promise<OAuthTokenResponse> {
        try {
            const data = new URLSearchParams({
                grant_type: request.grantType || 'refresh_token',
                refresh_token: request.refreshToken
            });

            const resp = await this._clientInstance.executeOAuthPost('refresh', data, region);
            const tokenResponse = resp.data as OAuthTokenResponse;
            
            // Get existing token data to preserve refresh token if not returned
            const existingTokenData = await this._tokenStorage.getTokens();
            
            // Update tokens with new access token
            const tokenData: StoredTokenData = {
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token || existingTokenData?.refreshToken,
                expiresAt: tokenResponse.expires_in ? Date.now() + (tokenResponse.expires_in * 1000) : undefined,
                tokenType: tokenResponse.token_type,
                scope: tokenResponse.scope
            };
            
            await this._tokenStorage.setTokens(tokenData);
            
            // Update shared options with new token
            this._options.token = tokenResponse.access_token;
            
            return tokenResponse;
        } catch (err) {
            if (err.response?.data) {
                const errorData = err.response.data as OAuthErrorResponse;
                throw new Exception(`OAuth token refresh failed: ${errorData.error} - ${errorData.error_description || 'Unknown error'}`, err);
            }
            throw new Exception('Unable to refresh access token', err);
        }
    }

    /**
     * Validate an access token and get token information
     * @param token - Access token to validate
     * @returns Promise containing token validation information
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const tokenInfo = await client.authMethods.validateToken('your_access_token');
     * 
     * if (tokenInfo.active) {
     *     console.log('Token is valid');
     *     console.log('Expires at:', new Date(tokenInfo.exp * 1000));
     *     console.log('Scope:', tokenInfo.scope);
     * } else {
     *     console.log('Token is invalid or expired');
     * }
     * ```
     */
    async validateToken(token: string, region?: string): Promise<TokenValidationResponse> {
        try {
            const resp = await this._clientInstance.executeOAuthGet('introspect', region, token);
            return resp.data as TokenValidationResponse;
        } catch (err) {
            if (err.response?.status === 401) {
                return { active: false };
            }
            throw new Exception('Unable to validate token', err);
        }
    }

    /**
     * Revoke an access token or refresh token
     * @param token - Token to revoke
     * @returns Promise indicating success
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * // Revoke access token on logout
     * await client.authMethods.revokeToken('access_token');
     * 
     * // Clear the client's token
     * client.clearToken();
     * ```
     */
    async revokeToken(token: string, region?: string): Promise<void> {
        try {
            const data = new URLSearchParams({
                token: token
            });

            await this._clientInstance.executeOAuthPost('revoke', data, region);
        } catch (err) {
            throw new Exception('Unable to revoke token', err);
        }
    }

    /**
     * Set the access token in the shared Options instance
     * Also stores token in keytar for consistency
     * @param token - Valid access token
     */
    async setAccessToken(token: string): Promise<void> {
        this._options.token = token;
        
        // Store token in keytar for consistency
        const tokenData: StoredTokenData = {
            accessToken: token,
            refreshToken: undefined, // No refresh token for manual tokens
            expiresAt: undefined, // No expiration for manual tokens
            tokenType: 'Bearer',
            scope: undefined
        };
        
        await this._tokenStorage.setTokens(tokenData);
    }

    /**
     * Get a valid access token - automatically refreshes if expired
     * @returns Promise containing valid access token or null if authentication required
     */
    public async getValidAccessToken(): Promise<string | null> {
        // Check if manual token is set (highest priority)
        if (this._options.token) {
            return this._options.token;
        }

        // Check for stored tokens
        const storedTokens = await this._tokenStorage.getTokens();
        if (!storedTokens) {
            return null;
        }

        // Check if stored token is still valid
        const isExpired = await this._tokenStorage.areTokensExpired();
        if (!isExpired) {
            this._options.token = storedTokens.accessToken;
            return storedTokens.accessToken;
        }

        // Token is expired, try to refresh
        if (storedTokens.refreshToken) {
            try {
                const newTokens = await this.refreshAccessToken({
                    refreshToken: storedTokens.refreshToken
                });
                return newTokens.access_token;
            } catch (error) {
                // Refresh failed, clear invalid tokens
                await this._tokenStorage.clearTokens();
                return null;
            }
        }

        // No refresh token available
        return null;
    }

    /**
     * Perform OAuth authentication flow
     * @param options - OAuth configuration options
     * @returns Promise resolving when authentication is complete
     */
    async performOAuthFlow(options: AuthUrlOptions): Promise<void> {
        // For now, this generates the auth URL that the user needs to visit
        // In a full implementation, this would handle the complete OAuth flow
        const authUrl = this.generateAuthUrl(options);
        throw new Exception(`OAuth flow not fully implemented. Please visit: ${authUrl}`);
    }

    /**
     * Clear all authentication data
     */
    public async clearAuthentication(): Promise<void> {
        await this._tokenStorage.clearTokens();
        this._options.token = undefined;
    }

    /**
     * Check if user is authenticated (has valid token)
     * @returns Promise resolving to true if authenticated
     */
    public async isAuthenticated(): Promise<boolean> {
        const validToken = await this.getValidAccessToken();
        return validToken !== null;
    }

    /**
     * Check if a token is expired based on expiration timestamp
     * @param expiresAt - Token expiration timestamp (seconds since epoch)
     * @param bufferSeconds - Buffer time in seconds to consider token expired early (default: 300 = 5 minutes)
     * @returns True if token is expired or will expire within buffer time
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
     * 
     * if (client.authMethods.isTokenExpired(expiresAt)) {
     *     console.log('Token is expired or will expire soon');
     *     // Refresh token or re-authenticate
     * }
     * ```
     */
    isTokenExpired(expiresAt: number, bufferSeconds: number = 300): boolean {
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= (expiresAt - bufferSeconds);
    }

    /**
     * Calculate token expiration timestamp from expires_in value
     * @param expiresIn - Token lifetime in seconds
     * @returns Expiration timestamp (seconds since epoch)
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const tokens = await client.authMethods.exchangeCodeForToken(request);
     * const expiresAt = client.authMethods.calculateExpirationTime(tokens.expires_in);
     * 
     * // Store expiration time for later use
     * localStorage.setItem('token_expires_at', expiresAt.toString());
     * ```
     */
    calculateExpirationTime(expiresIn: number): number {
        return Math.floor(Date.now() / 1000) + expiresIn;
    }

    /**
     * Generate a cryptographically secure random state parameter for OAuth
     * @param length - Length of the state string (default: 32)
     * @returns Random state string
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const state = client.authMethods.generateState();
     * 
     * // Store state for validation
     * sessionStorage.setItem('oauth_state', state);
     * 
     * // Use in authorization URL
     * const authUrl = client.authMethods.generateAuthUrl({
     *     redirectUri: 'https://yourapp.com/callback',
     *     state: state
     * });
     * ```
     */
    generateState(length: number = 32): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Create a token manager for automatic token refresh
     * @param config - Token manager configuration
     * @returns Token manager instance
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const tokenManager = client.authMethods.createTokenManager({
     *     accessToken: 'current_access_token',
     *     refreshToken: 'current_refresh_token',
     *     expiresAt: 1234567890
     * });
     * 
     * // Get valid token (auto-refreshes if needed and updates client)
     * const validToken = await tokenManager.getValidToken();
     * 
     * // Client is now updated with fresh token - make API calls
     * const content = await client.contentMethods.getContentItem(123, guid, locale);
     * ```
     */
    createTokenManager(config: TokenManagerConfig): TokenManager {
        return new TokenManager(this, config);
    }

    /**
     * Get current authentication state
     * @param token - Current access token
     * @param expiresAt - Token expiration timestamp
     * @param refreshToken - Optional refresh token
     * @returns Authentication state information
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * 
     * const authState = client.authMethods.getAuthState(
     *     localStorage.getItem('access_token'),
     *     parseInt(localStorage.getItem('token_expires_at')),
     *     localStorage.getItem('refresh_token')
     * );
     * 
     * if (authState.isAuthenticated) {
     *     console.log('User is authenticated');
     * } else {
     *     console.log('User needs to authenticate');
     * }
     * ```
     */
    public getAuthState(token?: string, expiresAt?: number, refreshToken?: string): AuthState {
        if (!token) {
            return { isAuthenticated: false };
        }

        const isExpired = expiresAt ? this.isTokenExpired(expiresAt) : false;
        
        return {
            isAuthenticated: !isExpired,
            token: token,
            expiresAt: expiresAt,
            refreshToken: refreshToken
        };
    }
}

/**
 * Token manager class for automatic token refresh
 */
export class TokenManager {
    private authMethods: AuthMethods;
    private config: TokenManagerConfig;

    constructor(authMethods: AuthMethods, config: TokenManagerConfig) {
        this.authMethods = authMethods;
        this.config = config;
    }

    /**
     * Get a valid access token, refreshing if necessary
     * This automatically updates the shared token in the AuthMethods instance
     * @returns Promise containing valid access token
     */
    async getValidToken(): Promise<string> {
        // Use the AuthMethods getValidAccessToken which handles the new token storage
        const validToken = await this.authMethods.getValidAccessToken();
        if (validToken) {
            return validToken;
        }

        // Fallback to old config-based approach for backwards compatibility
        if (this.config.expiresAt && !this.authMethods.isTokenExpired(this.config.expiresAt)) {
            return this.config.accessToken;
        }

        // Token is expired or about to expire, refresh it
        if (this.config.refreshToken) {
            try {
                const newTokens = await this.authMethods.refreshAccessToken({
                    refreshToken: this.config.refreshToken
                }, this.config.region);

                // Update configuration with new tokens
                this.config.accessToken = newTokens.access_token;
                this.config.expiresAt = this.authMethods.calculateExpirationTime(newTokens.expires_in);
                
                if (newTokens.refresh_token) {
                    this.config.refreshToken = newTokens.refresh_token;
                }

                return this.config.accessToken;
            } catch (error) {
                throw new Exception('Token refresh failed - user needs to re-authenticate', error);
            }
        }

        throw new Exception('No refresh token available - user needs to re-authenticate');
    }

    /**
     * Update the token configuration
     * @param config - New token configuration
     */
    updateConfig(config: Partial<TokenManagerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Get current token configuration
     * @returns Current token configuration
     */
    getConfig(): TokenManagerConfig {
        return { ...this.config };
    }
} 