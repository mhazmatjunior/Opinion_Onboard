import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { cookies } from "next/headers";
import { z } from "zod";

const reportSchema = z.object({
    opinionId: z.string(),
    reason: z.string(),
    details: z.string().optional(),
});

import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const body = await request.json();
        const { opinionId, reason, details } = reportSchema.parse(body);

        await db.insert(reports).values({
            reporterId: userId,
            opinionId,
            reason,
            details: details || "",
            status: "pending"
        });

        return NextResponse.json({ success: true, message: "Report submitted" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
