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
import { AuthMethods } from "./clientMethods/authMethods";
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
    authMethods!: AuthMethods
    
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
        this.authMethods = new AuthMethods(this._options);
        
        // Set up automatic token refresh for all method classes
        this.setupTokenRefresh();
        
        // If token is provided via options, store it in keytar
        if (options.token) {
            this.authMethods.setAccessToken(options.token).catch(error => {
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
            return await this.authMethods.getValidAccessToken();
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
     * Opens a popup window, handles the OAuth flow, and automatically exchanges tokens
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
        if (await this.authMethods.isAuthenticated()) {
            return;
        }

        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            throw new Exception('OAuth flow requires a browser environment. For Node.js, use exchangeCodeForToken() manually.');
        }

        const defaultOptions = {
            redirectUri: options?.redirectUri || `${window.location.origin}/auth-callback.html`,
            scope: options?.scope || 'openid profile email offline_access',
            region: options?.region
        };

        const authUrl = this.authMethods.generateAuthUrl({
            ...defaultOptions,
            state: this.authMethods.generateState()
        });

        return new Promise((resolve, reject) => {
            // Open popup window for OAuth
            const popup = window.open(
                authUrl,
                'agility-auth',
                'width=600,height=700,scrollbars=yes,resizable=yes'
            );

            if (!popup) {
                reject(new Exception('Popup blocked. Please allow popups and try again.'));
                return;
            }

            // Listen for postMessage events from the popup
            const messageHandler = (event: MessageEvent) => {
                // Ensure the message is from the popup window
                if (event.source !== popup) {
                    return;
                }

                // Handle authentication success
                if (event.data.type === 'AGILITY_AUTH_SUCCESS') {
                    cleanup();
                    popup.close();

                    const { code } = event.data;
                    
                    // Exchange code for tokens
                    this.authMethods.exchangeCodeForToken({
                        code: code,
                        redirectUri: defaultOptions.redirectUri
                    }, options?.region)
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
                    return;
                }

                // Handle authentication error
                if (event.data.type === 'AGILITY_AUTH_ERROR') {
                    cleanup();
                    popup.close();
                    reject(new Exception(`Authentication failed: ${event.data.error}`));
                    return;
                }
            };

            // Monitor popup for closure (fallback for manual close)
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    cleanup();
                    reject(new Exception('Authentication cancelled by user'));
                    return;
                }
            }, 1000);

            // Cleanup function to remove listeners and intervals
            const cleanup = () => {
                clearInterval(checkPopup);
                clearTimeout(timeoutId);
                window.removeEventListener('message', messageHandler);
            };

            // Set up message listener
            window.addEventListener('message', messageHandler);

            // Timeout after 5 minutes
            const timeoutId = setTimeout(() => {
                cleanup();
                if (!popup.closed) {
                    popup.close();
                }
                reject(new Exception('Authentication timeout'));
            }, 5 * 60 * 1000);
        });
    }

    /**
     * Exchange authorization code for access tokens (part of OAuth flow)
     * @param request - Token exchange request parameters
     * @param region - Optional region code
     * @returns Promise containing access and refresh tokens
     */
    async exchangeCodeForToken(request: { code: string; redirectUri: string; grantType?: string }, region?: string) {
        return await this.authMethods.exchangeCodeForToken(request, region);
    }

    /**
     * Check if the client is currently authenticated
     * @returns Promise resolving to true if authenticated with valid token
     */
    async isAuthenticated(): Promise<boolean> {
        return await this.authMethods.isAuthenticated();
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
        await this.authMethods.setAccessToken(token);
    }

    /**
     * Clear the current authentication token and stored tokens
     */
    async clearToken(): Promise<void> {
        await this.authMethods.clearAuthentication();
    }

    /**
     * Sign out the user by clearing all authentication data
     * @returns Promise indicating successful sign out
     */
    async signOut(): Promise<void> {
        await this.authMethods.clearAuthentication();
    }
}