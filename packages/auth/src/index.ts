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
		"gymApp://"
	],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: false, // Changed to false to support local development over HTTP
			httpOnly: true,
		},
	},
  plugins: [expo()]
});
