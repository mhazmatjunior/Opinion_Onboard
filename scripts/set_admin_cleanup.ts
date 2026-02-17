
import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq, ne } from "drizzle-orm";

async function setAdminAndCleanup() {
    try {
        const targetEmail = "mhazmatjunior@gmail.com";
        console.log(`Searching for user: ${targetEmail}...`);

        const user = await db.query.users.findFirst({
            where: eq(users.email, targetEmail)
        });

        if (user) {
            console.log(`User found: ${user.name} (${user.id})`);

            // precise update
            await db.update(users)
                .set({ role: "admin" })
                .where(eq(users.email, targetEmail));
            console.log(`User role updated to 'admin'.`);

            // Delete others
            console.log("Deleting other users...");
            // Using a raw query might be safer if delete with ne is tricky, but ne should work.
            // Let's verify we aren't deleting the admin.
            const others = await db.delete(users)
                .where(ne(users.email, targetEmail))
                .returning({ id: users.id, email: users.email });

            console.log(`Deleted ${others.length} other users.`);
            others.forEach(u => console.log(` - Deleted: ${u.email}`));

        } else {
            console.log(`User with email ${targetEmail} NOT FOUND.`);
            console.log("Please sign in with this email first so the record exists.");

            // List all users to see who IS there
            const allUsers = await db.query.users.findMany();
            console.log("Current users in DB:");
            allUsers.forEach(u => console.log(` - ${u.email} (${u.role})`));
        }
    } catch (error) {
        console.error("Error in script:", error);
    } finally {
        console.log("Done.");
        process.exit(0);
    }
}

setAdminAndCleanup();
