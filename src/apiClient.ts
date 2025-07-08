import { ContentMethods } from "./apiMethods/contentMethods";
import { AssetMethods } from "./apiMethods/assetMethods";
import { BatchMethods } from "./apiMethods/batchMethods";
import { ContainerMethods } from "./apiMethods/containerMethods";
import { InstanceUserMethods } from "./apiMethods/instanceUserMethods";
import { ModelMethods } from "./apiMethods/modelMethods";
import { PageMethods } from "./apiMethods/pageMethods";
import { Options } from "./models/options";
import { ServerUserMethods } from "./apiMethods/serverUserMethods";
import { WebhookMethods } from "./apiMethods/webhookMethods";
import { InstanceMethods } from "./apiMethods/instanceMethods";
import { AuthMethods } from "./apiMethods/authMethods";
import { TokenStorage } from "./tokenStorage";
import { Exception } from "./models/exception";

export class ApiClient {
    _options!: Options;
    contentMethods!: ContentMethods 
    assetMethods!: AssetMethods
    batchMethods!: BatchMethods
    containerMethods!: ContainerMethods 
    instanceUserMethods!: InstanceUserMethods
    instanceMethods!: InstanceMethods
    modelMethods!: ModelMethods
    pageMethods!: PageMethods
    serverUserMethods!: ServerUserMethods
    webhookMethods!: WebhookMethods
    private _authMethods!: AuthMethods
    
    constructor(options: Options = new Options()){
        this._options = options;
        this.contentMethods = new ContentMethods(this._options);
        this.assetMethods = new AssetMethods(this._options);
        this.batchMethods = new BatchMethods(this._options);
        this.containerMethods = new ContainerMethods(this._options);
        this.instanceUserMethods = new InstanceUserMethods(this._options);
        this.instanceMethods = new InstanceMethods(this._options);
        this.modelMethods = new ModelMethods(this._options);
        this.pageMethods = new PageMethods(this._options);
        this.serverUserMethods = new ServerUserMethods(this._options);
        this.webhookMethods = new WebhookMethods(this._options);
        this._authMethods = new AuthMethods(this._options);
        
        // Set up automatic token refresh for all method classes
        this.setupTokenRefresh();
        
        // If token is provided via options, store it in keytar
        if (options.token) {
            this._authMethods.setAccessToken(options.token).catch(error => {
                // Log error but don't fail constructor
                console.warn('Failed to store token in keytar:', error.message);
            });
        }
    }

    /**
     * Set up automatic token refresh for all method classes
     */
    private setupTokenRefresh(): void {
        const refreshHandler = async () => {
            return await this._authMethods.getValidAccessToken();
        };

        // Set token refresh handler on all method classes that use ClientInstance
        this.contentMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.assetMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.batchMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.containerMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.instanceUserMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.instanceMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.modelMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.pageMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.serverUserMethods._clientInstance.setTokenRefreshHandler(refreshHandler);
        this.webhookMethods._cleintInstance.setTokenRefreshHandler(refreshHandler);
    }

    /**
     * Authenticate with Agility CMS using OAuth flow
     * This method handles the entire OAuth authentication process internally
     * 
     * @param options - Optional OAuth configuration for custom setup
     * 
     * @example
     * ```typescript
     * // Simple OAuth authentication
     * const client = new ApiClient();
     * await client.auth();
     * 
     * // Client is now authenticated - make API calls directly
     * const content = await client.contentMethods.getContentItem(123, guid, locale);
     * ```
     */
    async auth(options?: { redirectUri?: string; scope?: string; region?: string }): Promise<void> {
        // Check if already authenticated with valid token
        if (await this._authMethods.isAuthenticated()) {
            return;
        }

        // For a Node.js environment, the OAuth flow requires external handling
        // This would typically involve:
        // 1. Generating auth URL
        // 2. User visiting URL and granting permission
        // 3. Getting authorization code from callback
        // 4. Exchanging code for tokens
        
        const defaultOptions = {
            redirectUri: options?.redirectUri || 'http://localhost:3000/auth/callback',
            scope: options?.scope || 'openid profile email offline_access',
            region: options?.region
        };

        const authUrl = this._authMethods.generateAuthUrl({
            ...defaultOptions,
            state: this._authMethods.generateState()
        });

        // In a real implementation, this would:
        // - Open browser to auth URL
        // - Start local server to handle callback
        // - Exchange code for tokens automatically
        
        throw new Exception(`OAuth flow requires manual implementation. Please visit: ${authUrl}\n\nAfter authorization, exchange the code using:\nconst tokens = await client.exchangeCodeForToken({ code: 'auth_code', redirectUri: '${defaultOptions.redirectUri}' });`);
    }

    /**
     * Exchange authorization code for access tokens (part of OAuth flow)
     * @param request - Token exchange request parameters
     * @param region - Optional region code
     * @returns Promise containing access and refresh tokens
     */
    async exchangeCodeForToken(request: { code: string; redirectUri: string; grantType?: string }, region?: string) {
        return await this._authMethods.exchangeCodeForToken(request, region);
    }

    /**
     * Check if the client is currently authenticated
     * @returns Promise resolving to true if authenticated with valid token
     */
    async isAuthenticated(): Promise<boolean> {
        return await this._authMethods.isAuthenticated();
    }

    /**
     * Set the access token directly (for manual token management)
     * Also stores token in keytar for consistency
     * @param token - Valid access token
     * 
     * @example
     * ```typescript
     * const client = new ApiClient();
     * await client.setToken('your_access_token');
     * 
     * // Now make API calls
     * const content = await client.contentMethods.getContentItem(123, guid, locale);
     * ```
     */
    async setToken(token: string): Promise<void> {
        await this._authMethods.setAccessToken(token);
    }

    /**
     * Clear the current authentication token and stored tokens
     */
    async clearToken(): Promise<void> {
        await this._authMethods.clearAuthentication();
    }
}