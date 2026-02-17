import { NextResponse } from "next/server";
import { db } from "@/db";
import { opinions, users, categories, reports, votes, comments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const unmoderatedOpinions = await db.query.opinions.findMany({
            where: eq(opinions.isModerated, false),
            orderBy: [desc(opinions.createdAt)],
            limit: 50, // Fetch in batches
            with: {
                author: true,
                category: true,
                votes: true // To calculate score if needed
            }
        });

        const formattedOpinions = unmoderatedOpinions.map((op: any) => ({
            id: op.id,
            content: op.content,
            authorName: op.isAnonymous ? "Anonymous" : op.author.name,
            authorId: op.author.id, // For banning context
            isAnonymous: op.isAnonymous,
            categoryName: op.category.name,
            timestamp: new Date(op.createdAt).toLocaleString(),
            voteScore: op.votes.reduce((acc: number, vote: any) => acc + (vote.type === "up" ? 1 : -1), 0)
        }));

        return NextResponse.json(formattedOpinions);
    } catch (error) {
        console.error("Moderation GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

const actionSchema = z.object({
    action: z.enum(["approve", "delete", "ban"]),
    opinionId: z.string(),
});

export async function POST(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await request.json();
        const { action, opinionId } = actionSchema.parse(body);

        if (action === "approve") {
            await db.update(opinions)
                .set({ isModerated: true })
                .where(eq(opinions.id, opinionId));
        } else if (action === "delete") {
            // Cascade delete related data
            // Note: Schema has onDelete: "cascade" but we can be explicit to be safe or rely on DB
            // Relying on DB constraint added in schema.ts
            await db.delete(opinions).where(eq(opinions.id, opinionId));
        } else if (action === "ban") {
            // Fetch opinion to get authorId
            const targetOpinion = await db.query.opinions.findFirst({
                where: eq(opinions.id, opinionId),
            });

            if (targetOpinion) {
                // 1. Ban the author
                await db.update(users)
                    .set({ isBanned: true })
                    .where(eq(users.id, targetOpinion.authorId));

                // 2. Delete the offending opinion
                await db.delete(opinions).where(eq(opinions.id, opinionId));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Moderation POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
