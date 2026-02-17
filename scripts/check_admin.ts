import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
    console.log("Checking for admin users...");
    const admins = await db.select().from(users).where(eq(users.role, "admin"));

    if (admins.length === 0) {
        console.log("No admin users found.");
    } else {
        console.log("Admin users found:");
        admins.forEach(admin => {
            console.log(`- ${admin.name} (${admin.email})`);
        });
    }
    process.exit(0);
}

checkAdmin();
