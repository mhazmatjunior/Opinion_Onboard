import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const updateCommentSchema = z.object({
    content: z.string().min(1).max(500),
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;
    const userId = session.user.id;

    try {
        const body = await request.json();
        const { content } = updateCommentSchema.parse(body);

        const result = await db
            .update(comments)
            .set({ content })
            .where(and(eq(comments.id, commentId), eq(comments.authorId, userId)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: "Forbidden or Not Found" }, { status: 403 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;
    const userId = session.user.id;

    try {
        const result = await db
            .delete(comments)
            .where(and(eq(comments.id, commentId), eq(comments.authorId, userId)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: "Forbidden or Not Found" }, { status: 403 });
        }

        return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
