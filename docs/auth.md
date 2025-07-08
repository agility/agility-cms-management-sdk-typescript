# Agility CMS & Management API TypeScript SDK

## Authentication & Setup

This guide covers how to authenticate with the Agility CMS Management API and initialize the SDK for making API requests.

**🚀 NEW: Simplified Authentication**
We now provide a streamlined authentication experience with secure token storage and automatic token refresh. The new `ApiClient.auth()` method handles the entire OAuth flow internally.

### Prerequisites
1. Valid Agility CMS credentials
2. A configured OAuth application in your Agility CMS instance
3. A valid redirect URI for OAuth flow
4. **Node.js**: For secure token storage, keytar is required (`npm install keytar`)

### Setup Instructions

#### Install keytar for Secure Token Storage
```bash
npm install keytar
```

**Platform Requirements:**
- **macOS**: Uses Keychain (built-in)
- **Windows**: Uses Windows Credential Store (built-in)
- **Linux**: Requires `libsecret` development package
  ```bash
  # Ubuntu/Debian
  sudo apt-get install libsecret-1-dev
  
  # Red Hat/CentOS
  sudo yum install libsecret-devel
  ```

### Authentication Approaches

You have two options for authentication:

#### 1. **Recommended: Simple OAuth Flow**
Use the new `ApiClient.auth()` method for streamlined authentication:

```typescript
import * as mgmtApi from '@agility/management-sdk';

// Simple OAuth authentication
const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();

// Client is now authenticated - make API calls directly
const guid = "your-website-guid";
const locale = "en-us";
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
```

The `auth()` method:
- Generates OAuth authorization URL
- Handles token exchange automatically
- Stores tokens securely using keytar
- Provides automatic token refresh

#### 2. **Manual Token Management (Existing Pattern)**
For applications that need to handle tokens manually, the traditional approach is still fully supported:

```typescript
import * as mgmtApi from "@agility/management-sdk";

// Manual token approach (still supported)
const options = new mgmtApi.Options();
options.token = "your-access-token";
const apiClient = new mgmtApi.ApiClient(options);

const guid = "your-website-guid";
const locale = "en-us";

const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log(JSON.stringify(contentItem));
```

For custom OAuth implementations, you can handle the OAuth flow manually:

Before using the SDK, you must authenticate against the Agility Management API to obtain a valid access token. This token is required for all subsequent API requests.

The authentication process uses OAuth 2.0 and requires multiple steps:

#### Step 1: Initiate Authorization Flow

First, initiate the authorization flow by making a GET request to the authorization endpoint:

```javascript
const authUrl = 'https://mgmt.aglty.io/oauth/authorize';

//if you wish to implement offline access using refresh tokens, use this URL (enables refresh tokens)
//const authUrl = 'https://mgmt.aglty.io/oauth/authorize?scope=offline-access '; 

const params = new URLSearchParams({
  response_type: 'code',
  redirect_uri: 'YOUR_REDIRECT_URI',
  state: 'YOUR_STATE',
  scope: 'openid profile email offline_access'
});

// Redirect the user to the authorization URL
window.location.href = `${authUrl}?${params.toString()}`;
```

#### Step 2: Exchange Authorization Code for Access Token

After successful authentication, you'll receive an authorization code at your redirect URI. Use this code to obtain an access token:

```javascript
const response = await fetch('https://mgmt.aglty.io/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    code: 'YOUR_AUTHORIZATION_CODE'
  })
});

const { access_token, refresh_token, expires_in } = await response.json();
```

#### Step 3: Initialize the SDK

Use the obtained token to initialize the SDK:

```javascript
import * as mgmtApi from "@agility/management-sdk";

// Initialize the Options Class with your authentication token
let options = new mgmtApi.Options();
options.token = access_token; // Use the token obtained from authentication

// Initialize the APIClient Class
let apiClient = new mgmtApi.ApiClient(options);

let guid = "<<Provide the Guid of the Website>>";
let locale = "<<Provide the locale of the Website>>"; // Example: en-us

// Now you can make authenticated requests
var contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log(JSON.stringify(contentItem));
```

#### Step 4: Refresh Access Tokens

When the access token expires, use the refresh token to obtain a new access token:

```javascript
const response = await fetch('https://mgmt.aglty.io/oauth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refresh_token: 'YOUR_REFRESH_TOKEN'
  })
});

const { access_token, refresh_token, expires_in } = await response.json();
```

### Important Authentication Notes

- **Token Lifetime**: The access token has a limited lifetime (typically 1 hour)
- **Refresh Tokens**: The refresh token can be used to obtain new access tokens
- **Security**: Store refresh tokens securely and never expose them in client-side code
- **Error Handling**: Implement proper error handling for authentication failures

### Making API Requests

Once authenticated, you can make requests using the SDK:

#### Using New Simple Authentication (Recommended)
```typescript
import * as mgmtApi from '@agility/management-sdk';

// Simple OAuth authentication
const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();

// Client is now authenticated and handles token refresh automatically
const guid = "your-website-guid";
const locale = "en-us";
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log(JSON.stringify(contentItem));
```

#### Manual Client Creation (Existing Pattern)
```javascript
import * as mgmtApi from "@agility/management-sdk";

//initialize the Options Class
let options = new mgmtApi.Options();

options.token = "<<Provide Auth Token>>"
//Initialize the APIClient Class
let apiClient = new mgmtApi.ApiClient(options);

let guid = "<<Provide the Guid of the Website>>";
let locale = "<<Provide the locale of the Website>>"; //Example: en-us

//make the request: get a content item with the ID '22'
var contentItem = await apiClient.contentMethods.getContentItem(22,guid, locale);

//To log the response of the contentItem object in console.
console.log(JSON.stringify(contentItem));
```

### OAuth Flow Examples

#### For Web Applications

```javascript
// Redirect user to authorization URL
function initiateAuth() {
    const authUrl = 'https://mgmt.aglty.io/oauth/authorize';
    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: window.location.origin + '/auth/callback',
        state: generateRandomState(),
        scope: 'openid profile email offline_access'
    });
    
    window.location.href = `${authUrl}?${params.toString()}`;
}

// Handle callback in your redirect URI endpoint
async function handleAuthCallback(code) {
    try {
        const response = await fetch('https://mgmt.aglty.io/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code: code
            })
        });
        
        const tokens = await response.json();
        
        // Store tokens securely
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        
        return tokens;
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}
```

#### For Server-Side Applications

```javascript
// Express.js example
app.get('/auth/agility', (req, res) => {
    const authUrl = 'https://mgmt.aglty.io/oauth/authorize';
    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: 'https://yourapp.com/auth/callback',
        state: req.session.state,
        scope: 'openid profile email offline_access'
    });
    
    res.redirect(`${authUrl}?${params.toString()}`);
});

app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;
    
    // Verify state parameter
    if (state !== req.session.state) {
        return res.status(400).send('Invalid state parameter');
    }
    
    try {
        const response = await fetch('https://mgmt.aglty.io/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code: code
            })
        });
        
        const tokens = await response.json();
        
        // Store tokens in session or database
        req.session.tokens = tokens;
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});
```

### Token Management

#### Automatic Token Refresh

```javascript
class AgilityTokenManager {
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
        this.accessToken = null;
        this.expiresAt = null;
    }
    
    async getValidToken() {
        if (!this.accessToken || Date.now() >= this.expiresAt) {
            await this.refreshAccessToken();
        }
        return this.accessToken;
    }
    
    async refreshAccessToken() {
        try {
            const response = await fetch('https://mgmt.aglty.io/oauth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: this.refreshToken
                })
            });
            
            const tokens = await response.json();
            
            this.accessToken = tokens.access_token;
            this.refreshToken = tokens.refresh_token; // Update refresh token if provided
            this.expiresAt = Date.now() + (tokens.expires_in * 1000);
            
            return tokens;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }
}

// Usage
const tokenManager = new AgilityTokenManager('your-refresh-token');
const token = await tokenManager.getValidToken();

const options = new mgmtApi.Options();
options.token = token;
const apiClient = new mgmtApi.ApiClient(options);
```

### Error Handling

#### Common Authentication Errors

```javascript
async function makeAuthenticatedRequest() {
    try {
        const apiClient = new mgmtApi.ApiClient({ token: accessToken });
        const result = await apiClient.contentMethods.getContentItem(123, guid, locale);
        return result;
    } catch (error) {
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('Authentication failed - refreshing token');
            await refreshAccessToken();
            
            // Retry the request
            const apiClient = new mgmtApi.ApiClient({ token: newAccessToken });
            return await apiClient.contentMethods.getContentItem(123, guid, locale);
        } else if (error.response?.status === 403) {
            // Insufficient permissions
            console.error('Access denied - insufficient permissions');
            throw new Error('User does not have permission for this operation');
        } else {
            // Other errors
            console.error('API request failed:', error.message);
            throw error;
        }
    }
}
```

### Migration Guide

#### Migrating from Manual OAuth to Simple Authentication

**Before (Manual OAuth):**
```typescript
// Old approach - manual OAuth handling
import * as mgmtApi from '@agility/management-sdk';

const options = new mgmtApi.Options();
options.token = 'manually-obtained-token';
const apiClient = new mgmtApi.ApiClient(options);

// Manual token refresh required
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
```

**After (Simple Authentication):**
```typescript
// New approach - automatic OAuth handling
import * as mgmtApi from '@agility/management-sdk';

const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();

// Automatic token refresh handled internally
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
```

#### Migrating from AuthMethods Class

**Before (AuthMethods Class):**
```typescript
import { AuthMethods } from '@agility/management-sdk';

const auth = new AuthMethods();
const client = auth.createAuthenticatedClient('token');
```

**After (Simple Authentication):**
```typescript
import * as mgmtApi from '@agility/management-sdk';

const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();
```

### Advanced Features

#### Secure Token Storage
The new authentication system uses OS-level secure storage:

- **macOS**: Keychain Access
- **Windows**: Windows Credential Store  
- **Linux**: libsecret (GNOME Keyring)

Tokens are encrypted and stored securely, with automatic cleanup on logout.

#### Automatic Token Refresh
The SDK now handles token refresh automatically:

```typescript
const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();

// Token refresh happens automatically on 401 errors
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
// If token was expired, it gets refreshed transparently
```

#### Custom OAuth Configuration
You can customize the OAuth flow:

```typescript
const apiClient = new mgmtApi.ApiClient();
await apiClient.auth({
    redirectUri: 'https://yourapp.com/custom-callback',
    scope: 'openid profile email offline_access',
    region: 'us' // or 'ca', 'eu', 'au', 'dev'
});
```

#### Manual Token Exchange
For custom OAuth implementations:

```typescript
const apiClient = new mgmtApi.ApiClient();

// Exchange authorization code for tokens
const tokens = await apiClient.exchangeCodeForToken({
    code: 'authorization_code_from_callback',
    redirectUri: 'https://yourapp.com/auth/callback'
});

// Tokens are automatically stored and used
```

### Best Practices

#### Security Considerations

1. **Use secure token storage (automatic with new auth)**
   ```typescript
   // ✅ Recommended - automatic secure storage
   const apiClient = new mgmtApi.ApiClient();
   await apiClient.auth(); // Tokens stored securely in OS keychain
   
   // ✅ CI/CD - manual token (for automated environments)
   const options = new mgmtApi.Options();
   options.token = process.env.AGILITY_ACCESS_TOKEN;
   const apiClient = new mgmtApi.ApiClient(options);
   
   // ❌ Bad - hardcoded tokens
   options.token = 'your-secret-token'; // Never do this
   ```

2. **Leverage automatic token refresh**
   ```typescript
   // ✅ Automatic token refresh (new approach)
   const apiClient = new mgmtApi.ApiClient();
   await apiClient.auth();
   
   // Token refresh happens automatically on 401 errors
   const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
   ```

3. **Handle authentication errors gracefully**
   ```typescript
   const apiClient = new mgmtApi.ApiClient();
   
   try {
       await apiClient.auth();
       const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
   } catch (error) {
       if (error.message.includes('OAuth flow requires manual implementation')) {
           // Handle OAuth flow manually
           console.log('Visit the OAuth URL to authenticate');
       } else {
           // Handle other auth errors
           console.error('Authentication failed:', error);
       }
   }
   ```

4. **Clear tokens on logout**
   ```typescript
   const apiClient = new mgmtApi.ApiClient();
   await apiClient.auth();
   
   // ... use API client ...
   
   // Clear tokens securely on logout
   await apiClient.clearToken();
   ```

#### Performance Optimization

1. **Reuse API client instances**
   ```javascript
   // ✅ Good - single instance
   const apiClient = new mgmtApi.ApiClient(options);
   
   // Use the same instance for multiple requests
   const content1 = await apiClient.contentMethods.getContentItem(1, guid, locale);
   const content2 = await apiClient.contentMethods.getContentItem(2, guid, locale);
   ```

2. **Implement request caching**
   ```javascript
   class CachedAgilityClient {
       constructor(options) {
           this.client = new mgmtApi.ApiClient(options);
           this.cache = new Map();
       }
       
       async getContentItem(id, guid, locale) {
           const cacheKey = `content-${id}-${guid}-${locale}`;
           
           if (this.cache.has(cacheKey)) {
               return this.cache.get(cacheKey);
           }
           
           const result = await this.client.contentMethods.getContentItem(id, guid, locale);
           this.cache.set(cacheKey, result);
           
           return result;
       }
   }
   ```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [CI/CD & Automated Environments](./cicd.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContentMethods](./content-methods.md)
- [ContainerMethods](./container-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
- [Multi-Instance Operations](./multi-instance-operations.md) 