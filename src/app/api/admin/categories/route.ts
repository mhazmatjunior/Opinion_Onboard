import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, users, opinions, votes, comments, reports } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const createCategorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
});

export async function POST(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const { name, description, slug } = createCategorySchema.parse(body);

        // Check if slug exists
        const existing = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
        if (existing) {
            return NextResponse.json({ error: "Category with this slug already exists" }, { status: 409 });
        }

        const newCategory = await db.insert(categories).values({
            name,
            description,
            slug,
        }).returning();

        return NextResponse.json(newCategory[0]);
    } catch (error) {
        console.error("API Error:", error);
        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach((issue) => {
                const path = issue.path[0];
                if (path) {
                    fieldErrors[path.toString()] = issue.message;
                }
            });
            // Return validation error format
            return NextResponse.json({
                error: "Validation failed",
                fieldErrors
            }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Category ID is required" }, { status: 400 });

        // Manual Cascade Delete
        // 1. Get all opinions in this category
        const categoryOpinions = await db.query.opinions.findMany({
            where: eq(opinions.categoryId, id),
            columns: { id: true }
        });

        const opinionIds = categoryOpinions.map((o: { id: string }) => o.id);

        if (opinionIds.length > 0) {
            // 2. Delete all related data for these opinions
            // Use Promise.all for parallel deletion of independent related tables
            await Promise.all([
                db.delete(votes).where(inArray(votes.opinionId, opinionIds)),
                db.delete(comments).where(inArray(comments.opinionId, opinionIds)),
                db.delete(reports).where(inArray(reports.opinionId, opinionIds))
            ]);

            // 3. Delete the opinions
            await db.delete(opinions).where(inArray(opinions.id, opinionIds));
        }

        // 4. Delete the category
        await db.delete(categories).where(eq(categories.id, id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Category Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
