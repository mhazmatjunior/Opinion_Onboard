export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { opinions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const updateOpinionSchema = z.object({
    content: z.string().min(5).max(500),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await headers();
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id: opinionId } = await context.params;
        const userId = session.user.id;
        const body = await request.json();
        const { content } = updateOpinionSchema.parse(body);

        const result = await db
            .update(opinions)
            .set({ content })
            .where(and(eq(opinions.id, opinionId), eq(opinions.authorId, userId)))
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
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await headers();
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id: opinionId } = await context.params;
        const userId = session.user.id;

        const result = await db
            .delete(opinions)
            .where(and(eq(opinions.id, opinionId), eq(opinions.authorId, userId)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: "Forbidden or Not Found" }, { status: 403 });
        }

        return NextResponse.json({ message: "Opinion deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
