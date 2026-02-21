export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { triggerNotification } from "@/lib/notifications";
import { opinions } from "@/db/schema";

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
    isAnonymous: z.boolean().optional(),
    parentId: z.string().uuid().optional().nullable(),
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

        const formattedComments = (opinionComments as any[]).map(c => ({
            id: c.id,
            content: c.content,
            authorName: c.isAnonymous ? "Anonymous" : (c.author.name || "Unknown"),
            authorId: c.author.id,
            isAnonymous: c.isAnonymous,
            parentId: c.parentId,
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
        const { content, isAnonymous, parentId } = commentSchema.parse(body);

        const newComment = await db.insert(comments).values({
            content,
            opinionId,
            authorId: userId,
            isAnonymous: !!isAnonymous,
            parentId: parentId || null,
        }).returning();

        // --- Notification Logic ---
        try {
            if (parentId) {
                // It's a reply: Notify the parent comment author
                const parentComment = await db.query.comments.findFirst({
                    where: eq(comments.id, parentId),
                });

                if (parentComment && parentComment.authorId !== userId) {
                    await triggerNotification({
                        userId: parentComment.authorId,
                        type: 'reply',
                        content: `${session.user.name || 'Someone'} replied to your comment: "${content.substring(0, 30)}..."`,
                        link: `/opinion/${opinionId}#comment-${newComment[0].id}`,
                    });
                }
            } else {
                // It's a top-level comment: Notify the opinion author
                const opinion = await db.query.opinions.findFirst({
                    where: eq(opinions.id, opinionId),
                });

                if (opinion && opinion.authorId !== userId) {
                    await triggerNotification({
                        userId: opinion.authorId,
                        type: 'reply',
                        content: `${session.user.name || 'Someone'} commented on your opinion: "${content.substring(0, 30)}..."`,
                        link: `/opinion/${opinionId}#comment-${newComment[0].id}`,
                    });
                }
            }
        } catch (notifError) {
            console.error("Failed to trigger notification for comment:", notifError);
        }
        // --------------------------

        return NextResponse.json(newComment[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
