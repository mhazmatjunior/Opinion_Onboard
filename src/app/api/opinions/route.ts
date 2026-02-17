import { NextResponse } from "next/server";
import { db } from "@/db";
import { opinions, users, categories, votes } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";

const postOpinionSchema = z.object({
    content: z.string().min(5).max(500),
    categoryId: z.string(),
    isAnonymous: z.boolean().default(false),
});

export async function GET(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    try {
        let whereClause = undefined;

        if (categorySlug) {
            const category = await db.query.categories.findFirst({
                where: eq(categories.slug, categorySlug),
            });

            if (category) {
                whereClause = eq(opinions.categoryId, category.id);
            } else {
                return NextResponse.json([]);
            }
        }

        const allOpinions = await db.query.opinions.findMany({
            where: whereClause,
            with: {
                author: true,
                category: true,
                votes: true,
                comments: true, // Also get comments for count
            },
            orderBy: [desc(opinions.createdAt)],
        });

        // Format for UI
        const formatted = allOpinions.map((op: any) => {
            const upvotes = op.votes.filter((v: any) => v.type === 'up').length;
            const downvotes = op.votes.filter((v: any) => v.type === 'down').length;
            const score = upvotes - downvotes;

            // Determine user vote
            let userVote: "up" | "down" | null = null;
            if (userId) {
                const vote = op.votes.find((v: any) => v.userId === userId);
                if (vote) {
                    userVote = vote.type as "up" | "down";
                }
            }

            return {
                id: op.id,
                content: op.content,
                isAnonymous: op.isAnonymous,
                authorName: op.isAnonymous ? "Anonymous" : op.author.name,
                authorId: op.author.id,
                voteScore: score,
                timestamp: op.createdAt.toString(),
                categoryId: op.category.id,
                categoryName: op.category.name,
                userVote: userVote,
                commentCount: op.comments.length
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();
        const { content, categoryId, isAnonymous } = postOpinionSchema.parse(body);

        // Verify user exists
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (user.isBanned) return NextResponse.json({ error: "Forbidden: You are banned." }, { status: 403 });

        const [newOpinion] = await db.insert(opinions).values({
            content,
            categoryId,
            authorId: userId,
            isAnonymous,
        }).returning();

        return NextResponse.json(newOpinion);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
