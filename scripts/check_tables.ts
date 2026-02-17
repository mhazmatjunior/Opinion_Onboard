
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log("Checking tables...");
    const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
    `;
    console.log("Tables found:", tables.map(r => r.table_name));

    console.log("\nChecking 'users' columns...");
    const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
    `;
    console.log("Users columns:", columns.map(c => `${c.column_name} (${c.data_type})`));

    console.log("\nVerifying role column existence...");
    try {
        const roles = await sql`SELECT role FROM users LIMIT 1`;
        console.log("Success! Role sample:", roles);
    } catch (err) {
        console.error("FAILED to select role:", err);
    }
}

main().catch(console.error);
