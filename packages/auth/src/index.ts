import { expo } from '@better-auth/expo';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@gymApp/db";

export const auth = betterAuth<BetterAuthOptions>({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [
		...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []), 
		"mybettertapp://", 
		"exp://", 
		"gymApp://",
		"http://10.0.2.2:3000",
		"http://localhost:3000"
	],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax", // Changed from none to lax for better HTTP support
			secure: false,   // Support HTTP development
			httpOnly: true,
		},
		disableCSRFCheck: true,
	},
    plugins: [expo()]
});
