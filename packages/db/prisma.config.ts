import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	schema: path.join("prisma", "schema.prisma"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
	datasource: {
		url: (() => {
			const url = process.env.DATABASE_URL;
			if (!url) {
				console.error("❌ ERROR: DATABASE_URL is not set in the environment.");
				console.error("Please make sure you have added it to the 'Environment' tab in Render.");
				// We don't throw here to allow 'prisma generate' to potentially work without a DB if needed,
				// but 'db push' will fail later with this helpful log.
				return "postgresql://MISSING_DATABASE_URL@localhost:5432/missing";
			}
			return url;
		})(),
	},
});
