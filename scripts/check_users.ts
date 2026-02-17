
import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema";

async function checkUsers() {
    console.log("Listing all users...");
    const allUsers = await db.select().from(users);
    console.log(`Total users: ${allUsers.length}`);
    allUsers.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
    process.exit(0);
}

checkUsers();
