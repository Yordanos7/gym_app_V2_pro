import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const scheme = (Array.isArray(Constants.expoConfig?.scheme) 
    ? Constants.expoConfig.scheme[0] 
    : (Constants.expoConfig?.scheme || 'gymApp')) as string;

export const authClient = createAuthClient({
	baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		expoClient({
			scheme: scheme,
			storagePrefix: scheme,
			storage: SecureStore,
		}),
	],
});
