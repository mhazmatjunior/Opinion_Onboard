import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
    console.warn("DATABASE_URL is missing in production environment!");
}

// Using a valid-format fallback to prevent neon from throwing during build-time import analysis
const sql = neon(databaseUrl || "postgres://localhost:5432/build_dummy");
export const db = drizzle(sql, { schema });
