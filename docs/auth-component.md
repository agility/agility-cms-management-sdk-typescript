# Agility CMS Authentication Component

## Overview

The Agility CMS Authentication Component provides a complete, reusable authentication system for React applications. It handles OAuth authentication, token management, and provides a rich set of hooks and components for building authentication UIs.

## Features

- **OAuth Authentication**: Secure popup-based authentication flow
- **Token Management**: Automatic token refresh and secure storage
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Multiple Display Modes**: Fullscreen, footer bar, and button-only modes
- **Extensive Customization**: Callbacks, styling, and slot-based customization
- **Performance Optimized**: Uses React hooks and context for efficient state management

## Installation

```bash
npm install @agility/management-sdk-typescript
```

## Basic Usage

### 1. Using the Authentication Hook

The simplest way to add authentication to your app:

```typescript
import { useAgilityAuth } from '@agility/management-sdk-typescript';

function MyApp() {
  const {
    isAuthenticated,
    isLoading,
    user,
    websiteAccess,
    selectedWebsite,
    selectedLocale,
    locales,
    error,
    authenticate,
    signOut,
    selectWebsite,
    selectLocale,
    clearError,
    hasSelection,
    currentSelection
  } = useAgilityAuth({
    redirectUri: 'https://myapp.com/auth-callback.html',
    scope: 'openid profile email offline_access',
    autoCheckAuth: true // Automatically check auth on mount
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  if (!isAuthenticated) {
    return (
      <button onClick={authenticate}>
        Sign in with Agility CMS
      </button>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.userName}!</h1>
      
      <select 
        value={selectedWebsite} 
        onChange={(e) => selectWebsite(e.target.value)}
      >
        <option value="">Choose a website...</option>
        {websiteAccess.map(site => (
          <option key={site.websiteGuid} value={site.websiteGuid}>
            {site.websiteName}
          </option>
        ))}
      </select>

      {selectedWebsite && (
        <select 
          value={selectedLocale} 
          onChange={(e) => selectLocale(e.target.value)}
        >
          <option value="">Choose a locale...</option>
          {locales.map(locale => (
            <option key={locale.localeCode} value={locale.localeCode}>
              {locale.localeName}
            </option>
          ))}
        </select>
      )}

      {hasSelection && (
        <div>
          <p>Current Selection: {currentSelection?.websiteName} - {currentSelection?.localeName}</p>
        </div>
      )}
      
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 2. Using the Context Provider

For larger applications, use the context provider to share authentication state:

```typescript
import { AuthProvider, useAuthContext } from '@agility/management-sdk-typescript';

// App component
function App() {
  return (
    <AuthProvider>
      <MyAuthenticatedApp />
    </AuthProvider>
  );
}

// Child component that uses auth context
function MyAuthenticatedApp() {
  const { state, actions } = useAuthContext();
  
  return (
    <div>
      {state.isAuthenticated ? (
        <Dashboard user={state.user} />
      ) : (
        <LoginForm onLogin={actions.setAuthenticated} />
      )}
    </div>
  );
}
```

### 3. Using Granular Context Hooks

For more specific use cases, use the granular hooks:

```typescript
import { 
  useIsAuthenticated, 
  useCurrentUser, 
  useSelection, 
  useLoadingStates,
  useAuthError
} from '@agility/management-sdk-typescript';

function UserProfile() {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();
  const { isLoading } = useLoadingStates();
  
  if (!isAuthenticated) return <div>Please log in</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user?.userName}</h2>
      <p>{user?.emailAddress}</p>
    </div>
  );
}

function WebsiteSelector() {
  const { selectedWebsite, selectedLocale, hasSelection } = useSelection();
  const { error, clearError } = useAuthError();
  
  return (
    <div>
      {error && (
        <div className="error">
          {error}
          <button onClick={clearError}>Clear</button>
        </div>
      )}
      
      {hasSelection && (
        <div>Selected: {selectedWebsite} - {selectedLocale}</div>
      )}
    </div>
  );
}
```

## Advanced Usage

### Custom OAuth Configuration

```typescript
const auth = useAgilityAuth({
  redirectUri: 'https://myapp.com/auth-callback.html',
  scope: 'openid profile email offline_access',
  region: 'us-west-2',
  autoCheckAuth: true
});
```

### Website Selection with Validation

```typescript
import { 
  useWebsiteSelection, 
  validateSelection, 
  sortWebsitesByName 
} from '@agility/management-sdk-typescript';

function WebsiteManager() {
  const auth = useAgilityAuth();
  
  const selection = useWebsiteSelection(
    auth.websiteAccess,
    auth.selectedWebsite,
    auth.locales,
    auth.selectedLocale,
    auth.isLoadingLocales,
    auth.selectWebsite,
    auth.selectLocale
  );

  const sortedWebsites = sortWebsitesByName(selection.websites);
  const validation = validateSelection(
    selection.websites,
    selection.selectedWebsite,
    selection.locales,
    selection.selectedLocale
  );

  return (
    <div>
      <select onChange={(e) => selection.selectWebsite(e.target.value)}>
        {sortedWebsites.map(site => (
          <option key={site.websiteGuid} value={site.websiteGuid}>
            {site.websiteName}
          </option>
        ))}
      </select>
      
      {!validation.isValid && (
        <div className="validation-errors">
          {validation.errors.map(error => (
            <div key={error} className="error">{error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Type Definitions

### Core Types

```typescript
interface AgilityAuthConfig {
  // Callbacks
  onSignIn?: (user: ServerUser) => void;
  onSignOut?: () => void;
  onWebsiteSelect?: (website: WebsiteAccess) => void;
  onLocaleSelect?: (locale: LocaleInfo) => void;
  
  // Display & Behavior
  mode?: 'fullscreen' | 'footer' | 'button-only';
  theme?: 'light' | 'dark' | 'auto';
  showCurrentSelection?: boolean;
  
  // OAuth Settings
  redirectUri?: string;
  scope?: string;
  region?: string;
}

interface WebsiteAccess {
  websiteGuid: string;
  websiteName: string;
  websiteDescription?: string;
}

interface LocaleInfo {
  localeCode: string;
  localeID: number;
  localeName: string;
  isDefault?: boolean;
  isEnabled?: boolean;
}
```

## Coming Soon

The following UI components are currently in development:

- **AgilityAuth Component**: Full-featured authentication component
- **AuthButton**: Standalone authentication button
- **WebsiteSelector**: Website selection dropdown
- **LocaleSelector**: Locale selection dropdown
- **UserInfo**: User information display
- **Footer Mode**: Collapsible footer bar implementation

## Migration from Direct SDK Usage

If you're currently using the SDK directly, you can gradually migrate:

```typescript
// Before: Direct SDK usage
const client = new ApiClient();
await client.auth();
const user = await client.serverUserMethods.me();

// After: Using the hook
const { authenticate, user, isAuthenticated } = useAgilityAuth();
if (!isAuthenticated) {
  await authenticate();
}
// user is now available directly from the hook
```

## Performance Considerations

- State is managed using React's `useReducer` for optimal performance
- Context values are memoized to prevent unnecessary re-renders
- All callback functions are memoized with `useCallback`
- Automatic cleanup of event listeners and timeouts

## Browser Support

- Modern browsers with ES2017+ support
- React 16.8+ (hooks support)
- TypeScript 4.0+ (optional but recommended)

## Error Handling

The authentication system provides comprehensive error handling:

```typescript
const { error, clearError } = useAuthError();

// Display errors to user
if (error) {
  return (
    <div className="error">
      {error}
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Security

- Tokens are stored securely using `keytar` (Node.js) or `localStorage` (browser)
- Automatic token refresh prevents expired token issues
- OAuth flow uses secure popup window with proper origin validation
- All sensitive operations are handled server-side

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/agility/agility-cms-management-sdk-typescript). 