import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
import { ApiClient } from '../../../apiClient';
import { ServerUser } from '../../../models/serverUser';
import { WebsiteAccess, LocaleInfo } from '../../../models/authComponent';
import { 
  AuthReducerState, 
  AuthAction, 
  UseAgilityAuthReturn, 
  initialAuthState 
} from '../../../models/authState';

/**
 * Authentication reducer to manage complex state updates
 */
function authReducer(state: AuthReducerState, action: AuthAction): AuthReducerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_LOADING_LOCALES':
      return { ...state, isLoadingLocales: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_WEBSITE_ACCESS':
      return { ...state, websiteAccess: action.payload };
    
    case 'SET_SELECTED_WEBSITE':
      return { ...state, selectedWebsite: action.payload };
    
    case 'SET_SELECTED_LOCALE':
      return { ...state, selectedLocale: action.payload };
    
    case 'SET_LOCALES':
      return { ...state, locales: action.payload };
    
    case 'SIGN_OUT':
      return {
        ...initialAuthState,
        // Keep any non-auth related state if needed
      };
    
    case 'RESET_STATE':
      return initialAuthState;
    
    default:
      return state;
  }
}

/**
 * Custom hook for Agility CMS authentication
 * Handles OAuth flow, token management, and user state
 */
export function useAgilityAuth(options?: {
  redirectUri?: string;
  scope?: string;
  region?: string;
  autoCheckAuth?: boolean;
}): UseAgilityAuthReturn {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [tokenInfo, setTokenInfo] = useState<{
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType?: string;
    scope?: string;
  }>({});
  const apiClient = useMemo(() => new ApiClient(), []);

  // Auto-check authentication status on mount
  useEffect(() => {
    if (options?.autoCheckAuth !== false) {
      checkAuthStatus();
    }
  }, []);

  // Update token info whenever authentication state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      updateTokenInfo();
    } else {
      setTokenInfo({});
    }
  }, [state.isAuthenticated]);

  /**
   * Update token information from storage
   */
  const updateTokenInfo = useCallback(async () => {
    try {
      const tokenStorage = apiClient.authMethods['_tokenStorage'];
      if (tokenStorage) {
        const tokens = await tokenStorage.getTokens();
        if (tokens) {
          setTokenInfo({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
            tokenType: tokens.tokenType,
            scope: tokens.scope
          });
        }
      }
    } catch (error) {
      console.error('Failed to update token info:', error);
    }
  }, [apiClient]);

  /**
   * Check if user is already authenticated
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      const isAuthenticated = await apiClient.authMethods.isAuthenticated();
      
      if (isAuthenticated) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        
        // Get user info and website access
        const user = await apiClient.serverUserMethods.me();
        dispatch({ type: 'SET_USER', payload: user });
        
        // Extract website access information
        const websites: WebsiteAccess[] = user.websiteAccess?.map((access: any, index: number) => ({
          websiteGuid: access.guid || `website-${index}`,
          websiteName: (access.displayName || access.websiteName) || access.guid || `Website ${index + 1}`,
          websiteDescription: access.description || access.websiteName || access.guid || `Website ${index + 1}`
        })) || [];
        
        dispatch({ type: 'SET_WEBSITE_ACCESS', payload: websites });
        
        // Update token info
        await updateTokenInfo();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check authentication status' });
    }
  }, [apiClient, updateTokenInfo]);

  /**
   * Authenticate user using OAuth flow
   */
  const authenticate = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Use the SDK's built-in OAuth flow
      await apiClient.auth({
        redirectUri: options?.redirectUri,
        scope: options?.scope,
        region: options?.region
      });

      // Get user info after successful authentication
      const user = await apiClient.serverUserMethods.me();
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });

      // Extract website access information
      const websites: WebsiteAccess[] = user.websiteAccess?.map((access: any, index: number) => ({
        websiteGuid: access.guid || `website-${index}`,
        websiteName: (access.displayName || access.websiteName) || access.guid || `Website ${index + 1}`,
        websiteDescription: access.description || access.websiteName || access.guid || `Website ${index + 1}`
      })) || [];

      dispatch({ type: 'SET_WEBSITE_ACCESS', payload: websites });
      
      // Update token info
      await updateTokenInfo();
      
    } catch (error) {
      console.error('Authentication failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Authentication failed. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiClient, options, updateTokenInfo]);

  /**
   * Sign out user and clear all state
   */
  const signOut = useCallback(async () => {
    try {
      await apiClient.signOut();
      dispatch({ type: 'SIGN_OUT' });
      setTokenInfo({});
    } catch (error) {
      console.error('Sign out failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sign out. Please try again.' });
    }
  }, [apiClient]);

  /**
   * Select a website and load its locales
   */
  const selectWebsite = useCallback(async (websiteGuid: string) => {
    dispatch({ type: 'SET_SELECTED_WEBSITE', payload: websiteGuid });
    dispatch({ type: 'SET_SELECTED_LOCALE', payload: '' });
    dispatch({ type: 'SET_LOCALES', payload: [] });

    if (!websiteGuid) return;

    dispatch({ type: 'SET_LOADING_LOCALES', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const localesList = await apiClient.instanceMethods.getLocales(websiteGuid);
      
      // Convert to our expected format
      const formattedLocales: LocaleInfo[] = localesList.map((locale: any, index: number) => ({
        localeCode: locale.code || locale || `locale-${index}`,
        localeID: locale.id || index,
        localeName: locale.name || locale.description || locale || `Locale ${index + 1}`,
        isDefault: locale.isDefault || false,
        isEnabled: locale.isEnabled !== false
      }));

      dispatch({ type: 'SET_LOCALES', payload: formattedLocales });
    } catch (error) {
      console.error('Failed to fetch locales:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch locales for selected website' });
    } finally {
      dispatch({ type: 'SET_LOADING_LOCALES', payload: false });
    }
  }, [apiClient]);

  /**
   * Select a locale
   */
  const selectLocale = useCallback((localeCode: string) => {
    dispatch({ type: 'SET_SELECTED_LOCALE', payload: localeCode });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Get current authentication tokens
   */
  const getTokens = useCallback(async () => {
    try {
      const tokenStorage = apiClient.authMethods['_tokenStorage'];
      if (tokenStorage) {
        return await tokenStorage.getTokens();
      }
      return null;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  }, [apiClient]);

  /**
   * Get API client instance for direct access
   */
  const getApiClient = useCallback(() => {
    return apiClient;
  }, [apiClient]);

  // Computed values
  const isReady = useMemo(() => 
    state.isAuthenticated && !state.isLoading && !state.isLoadingLocales,
    [state.isAuthenticated, state.isLoading, state.isLoadingLocales]
  );

  const hasSelection = useMemo(() => 
    Boolean(state.selectedWebsite && state.selectedLocale),
    [state.selectedWebsite, state.selectedLocale]
  );

  const currentSelection = useMemo(() => {
    if (!hasSelection) return null;
    
    const website = state.websiteAccess.find(w => w.websiteGuid === state.selectedWebsite);
    const locale = state.locales.find(l => l.localeCode === state.selectedLocale);
    
    return website && locale ? {
      websiteName: website.websiteName,
      localeName: locale.localeName
    } : null;
  }, [hasSelection, state.websiteAccess, state.selectedWebsite, state.locales, state.selectedLocale]);

  return {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isLoadingLocales: state.isLoadingLocales,
    user: state.user,
    websiteAccess: state.websiteAccess,
    selectedWebsite: state.selectedWebsite,
    selectedLocale: state.selectedLocale,
    locales: state.locales,
    error: state.error,
    
    // Actions
    authenticate,
    signOut,
    selectWebsite,
    selectLocale,
    clearError,
    
    // Computed
    isReady,
    hasSelection,
    currentSelection,
    
    // Token and debug info
    tokenInfo,
    getTokens,
    getApiClient,
  };
} 