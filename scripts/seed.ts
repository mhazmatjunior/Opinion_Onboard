import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { categories as mockCategories } from "../src/lib/mockData";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log("Seeding database...");

    // 1. Create Users
    console.log("Creating users...");
    const usersData = [
        { name: "Admin User", email: "admin@example.com", role: "admin" as const },
        { name: "John Doe", email: "john@example.com", role: "user" as const },
        { name: "Jane Smith", email: "jane@example.com", role: "user" as const },
    ];

    const createdUsers = await db.insert(schema.users).values(usersData).returning();
    console.log(`Created ${createdUsers.length} users.`);

    // 2. Create Categories
    console.log("Creating categories...");
    // Use mock categories but need to ensure structure matches schema
    const categoriesData = mockCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        description: c.description
    }));

    // Upsert categories to avoid duplicates on re-seed
    // Drizzle doesn't have a simple "insert or ignore" for all DBs, but for PG we can use onConflictDoNothing if we had a unique constraint (slug is unique).
    const createdCategories = await db.insert(schema.categories)
        .values(categoriesData)
        .onConflictDoNothing({ target: schema.categories.slug })
        .returning();

    console.log(`Created ${createdCategories.length} new categories.`);

    // If we want to link opinions, we need the IDs. Fetch all categories.
    const allCategories = await db.select().from(schema.categories);
    const allUsers = await db.select().from(schema.users);

    if (allUsers.length > 0 && allCategories.length > 0) {
        console.log("Creating sample opinions...");
        const opinionsData = [
            {
                content: "The new return-to-office policy was announced without any employee consultation.",
                authorId: allUsers[1].id, // John
                categoryId: allCategories.find(c => c.slug === 'workplace-culture')?.id || allCategories[0].id,
                isAnonymous: true,
            },
            {
                content: "Our team lead actively encourages work-life balance.",
                authorId: allUsers[2].id, // Jane
                categoryId: allCategories.find(c => c.slug === 'workplace-culture')?.id || allCategories[0].id,
                isAnonymous: false,
            },
            {
                content: "City planning needs to prioritize pedestrians over cars.",
                authorId: allUsers[1].id,
                categoryId: allCategories.find(c => c.slug === 'government-policy')?.id || allCategories[0].id,
                isAnonymous: false,
            }
        ];

        await db.insert(schema.opinions).values(opinionsData);
        console.log("Sample opinions created.");
    }

    console.log("Seeding complete!");
}

main().catch((err) => {
    console.error("Seeding failed:");
    console.error(err);
    process.exit(1);
});
