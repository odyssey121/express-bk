import "dotenv/config"; // Optional: if you're using dotenv to load environment variables
import { defineConfig } from "prisma/config";
const path = require("path");

export default defineConfig({
    // Specifies the path to your main Prisma schema file.
    // This is useful if your schema isn't located at the default 'prisma/schema.prisma'.
    schema: path.join("src", "prisma", "schema.prisma"),

    // Configuration for Prisma Migrations.
    migrations: {
        // Specifies the directory where migration files are stored.
        path: path.join("src", "prisma", "migrations"),

        // Defines the command to run your database seed script.
        // This example uses 'tsx' for running TypeScript seed files.
        // The '--env-file=.env' flag is important if your seed script relies on environment variables
        // and you're not loading them globally (e.g., via 'dotenv/config').
        seed: `ts-node --transpile-only src/prisma/seed.ts`,
    },

    // Optional: Configuration for Prisma Studio.
    // This example demonstrates using a driver adapter for Prisma Studio,
    // which can be useful for connecting to databases through specific adapters.
    // studio: {
    //   adapter: async (env: { DB_URL: string }) => {
    //     // Example using a PostgreSQL driver adapter
    //     const { PrismaPg } = await import("@prisma/adapter-pg");
    //     return new PrismaPg({ connectionString: env.DB_URL });
    //   },
    // },

    // Optional: Enable early access features.
    // earlyAccess: true,
});