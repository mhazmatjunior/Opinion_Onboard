import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        return NextResponse.json({ user: null });
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            // Cookie is stale/invalid
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Auth check failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
