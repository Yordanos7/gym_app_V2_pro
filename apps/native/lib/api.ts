import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SCHEME = Constants.expoConfig?.scheme || 'gymApp';

// Potential keys where Better Auth might store the token
const TOKEN_KEYS = [
    `${SCHEME}.better-auth.session_token`,
    `${SCHEME}.session_token`,
    'better-auth.session_token',
    'session_token',
    // Permutations for different versions of the expo plugin
    `${SCHEME}.better-auth.session`,
    'better-auth.session',
    `${SCHEME}.session`,
    'session'
];

export async function getSessionToken(): Promise<string | null> {
    try {
        console.log(`[API] Searching SecureStore (Scheme: ${SCHEME})`);
        
        // Better Auth Expo client stores token in various keys depending on version/prefix
        const possibleKeys = [
            `${SCHEME}.better-auth.session_token`,
            `${SCHEME}.better-auth.session`,
            `${SCHEME}.session_token`,
            `${SCHEME}.session`,
            'better-auth.session_token',
            'better-auth.session',
            'session_token',
            'session',
            // Some versions use underscores
            `${SCHEME}_better_auth_session_token`,
            `${SCHEME}_session_token`,
        ];

        for (const key of possibleKeys) {
            const token = await SecureStore.getItemAsync(key);
            if (token) {
                console.log(`[API] Discoverd token in: ${key}`);
                return token;
            }
        }
        
        console.warn(`[API] Could not find session token in any known SecureStore keys.`);
        return null;
    } catch (error) {
        console.error('[API] Error reading SecureStore:', error);
        return null;
    }
}

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = await getSessionToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['Cookie'] = `better-auth.session_token=${token}`;
    }

    console.log(`[API] Fetching ${url} (Token: ${token ? 'YES' : 'NO'})`);
    
    return fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });
}
