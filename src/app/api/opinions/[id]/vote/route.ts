import { NextResponse } from "next/server";
import { db } from "@/db";
import { votes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

const voteSchema = z.object({
    type: z.enum(["up", "down"]),
});

import { auth } from "@/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { id: opinionId } = await params;

    try {
        const body = await request.json();
        const { type } = voteSchema.parse(body);

        const existingVote = await db.query.votes.findFirst({
            where: and(
                eq(votes.userId, userId),
                eq(votes.opinionId, opinionId)
            )
        });

        if (existingVote) {
            if (existingVote.type === type) {
                // Remove vote
                await db.delete(votes).where(eq(votes.id, existingVote.id));
                return NextResponse.json({ message: "Vote removed", status: "removed" });
            } else {
                // Update vote
                await db.update(votes)
                    .set({ type })
                    .where(eq(votes.id, existingVote.id));
                return NextResponse.json({ message: "Vote updated", status: "updated" });
            }
        } else {
            // Create vote
            await db.insert(votes).values({
                userId,
                opinionId,
                type
            });
            return NextResponse.json({ message: "Vote added", status: "added" });
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
