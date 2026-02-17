import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log("Adding dummy user...");

    const userData = {
        name: "Dummy User 2",
        email: "dummy2@example.com",
        role: "user" as const,
    };

    const createdUser = await db.insert(schema.users).values(userData).returning();
    console.log("Created user:", createdUser[0]);
}

main().catch((err) => {
    console.error("Failed to add user:");
    console.error(err);
    process.exit(1);
});
