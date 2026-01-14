import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SCHEME = (Array.isArray(Constants.expoConfig?.scheme) 
    ? Constants.expoConfig.scheme[0] 
    : (Constants.expoConfig?.scheme || 'gymApp')) as string;

import { authClient } from "./auth-client";

export async function getSessionToken(): Promise<string | null> {
    try {
        // Attempt 1: Standard library way
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.session?.token) {
            console.log(`[API] Token found via authClient.getSession()`);
            return sessionData.session.token;
        }

        // Attempt 2: Brute-force SecureStore search with all possible keys
        const possibleKeys = [
            `${SCHEME}.better-auth.session_token`,
            `${SCHEME}.session_token`,
            'better-auth.session_token',
            'session_token',
            `${SCHEME}.better-auth.session`,
            `${SCHEME}.session`,
            'better-auth.session',
            'session',
        ];

        for (const key of possibleKeys) {
            const token = await SecureStore.getItemAsync(key);
            if (token) {
                console.log(`[API] Token found via brute-force key: ${key}`);
                return token;
            }
        }

        console.warn(`[API] FAILED to find any session token.`);
        return null;
    } catch (error) {
        console.error('[API] getSessionToken error:', error);
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
        // Better Auth 1.4+ works best with Bearer or plain token in Authorization
        headers['Authorization'] = `Bearer ${token}`;
        
        // Mobile apps often need to explicitly set their origin for CSRF
        headers['Origin'] = `${SCHEME}://`;
        
        // Fallback for some older server-side session checks
        headers['x-session-token'] = token;
        
        // Native fetch doesn't handle cookies like a browser, so we pass it manually
        headers['Cookie'] = `better-auth.session_token=${token}`;
    }

    console.log(`[API] Fetching ${url} | Token: ${token ? 'YES' : 'NO'}`);
    
    return fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });
}
