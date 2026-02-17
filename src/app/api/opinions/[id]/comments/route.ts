import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: opinionId } = await params;

    try {
        const opinionComments = await db.query.comments.findMany({
            where: eq(comments.opinionId, opinionId),
            orderBy: [desc(comments.createdAt)],
            with: {
                author: true
            }
        });

        const formattedComments = opinionComments.map(c => ({
            id: c.id,
            content: c.content,
            authorName: c.author.name,
            authorId: c.author.id,
            createdAt: c.createdAt,
        }));

        return NextResponse.json(formattedComments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

import { auth } from "@/auth";

// ... existing imports

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { id: opinionId } = await params;

    try {
        const body = await request.json();
        const { content } = commentSchema.parse(body);

        const newComment = await db.insert(comments).values({
            content,
            opinionId,
            authorId: userId,
        }).returning();

        return NextResponse.json(newComment[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
