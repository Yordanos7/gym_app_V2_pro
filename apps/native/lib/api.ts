import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SCHEME = Constants.expoConfig?.scheme || 'gymApp';

// Potential keys where Better Auth might store the token
// The expo plugin typically uses `${scheme}.better-auth.session_token`
const TOKEN_KEYS = [
    `${SCHEME}.better-auth.session_token`,
    `${SCHEME}.session_token`,
    'better-auth.session_token',
    'session_token'
];

export async function getSessionToken(): Promise<string | null> {
    try {
        for (const key of TOKEN_KEYS) {
            const token = await SecureStore.getItemAsync(key);
            if (token) {
                console.log(`[API] Found token in key: ${key}`);
                return token;
            }
        }
        console.log('[API] No token found in SecureStore');
        return null;
    } catch (error) {
        console.error('[API] Error reading token:', error);
        return null;
    }
}

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = await getSessionToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as Record<string, string>;

    if (token) {
        // Better Auth expects the token in the Authorization header or Cookie
        // We'll try both to be safe, but usually Bearer is preferred for APIs
        headers['Authorization'] = `Bearer ${token}`;
        // Also simulate a cookie if needed (some implementations check this)
        // headers['Cookie'] = `better-auth.session_token=${token}`; 
    }

    // Ensure credentials include is set, though mostly relevant for web
    const config = {
        ...options,
        headers,
        credentials: 'include' as RequestCredentials,
    };

    console.log(`[API] Fetching ${url} with headers:`, JSON.stringify(headers, null, 2));
    
    const response = await fetch(url, config);

    if (response.status === 401) {
        console.error('[API] 401 Unauthorized - Token may be invalid');
    }

    return response;
}
