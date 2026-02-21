import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        // Upsert the subscription
        await db
            .insert(pushSubscriptions)
            .values({
                userId: session.user.id,
                subscription: token,
            })
            .onConflictDoUpdate({
                target: pushSubscriptions.userId,
                set: { subscription: token },
            });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save push subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
