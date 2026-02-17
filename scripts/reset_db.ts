
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log("⚠️  Resetting database: Dropping tables...");

    try {
        await sql`DROP TABLE IF EXISTS "comments" CASCADE`;
        await sql`DROP TABLE IF EXISTS "reports" CASCADE`;
        await sql`DROP TABLE IF EXISTS "votes" CASCADE`;
        await sql`DROP TABLE IF EXISTS "opinions" CASCADE`;
        await sql`DROP TABLE IF EXISTS "categories" CASCADE`;
        await sql`DROP TABLE IF EXISTS "verification_tokens" CASCADE`;
        await sql`DROP TABLE IF EXISTS "sessions" CASCADE`;
        await sql`DROP TABLE IF EXISTS "accounts" CASCADE`;
        await sql`DROP TABLE IF EXISTS "users" CASCADE`;
        await sql`DROP TABLE IF EXISTS "account" CASCADE`;
        await sql`DROP TABLE IF EXISTS "session" CASCADE`;
        await sql`DROP TABLE IF EXISTS "verificationToken" CASCADE`;

        console.log("✅ Tables dropped.");
    } catch (e) {
        console.error("Error dropping tables:", e);
    }
}

main().catch(console.error);
