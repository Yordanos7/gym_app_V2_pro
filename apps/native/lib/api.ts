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

import { authClient } from "./auth-client";

export async function getSessionToken(): Promise<string | null> {
    try {
        const { data: session } = await authClient.getSession();
        
        if (session?.session?.token) {
            console.log(`[API] Token retrieved from authClient session object.`);
            return session.session.token;
        }

        console.warn(`[API] No token found in active session.`);
        return null;
    } catch (error) {
        console.error('[API] Error getting session from authClient:', error);
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
