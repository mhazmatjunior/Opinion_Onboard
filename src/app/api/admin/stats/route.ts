import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, opinions, reports, categories } from "@/db/schema";
import { auth } from "@/auth";
import { eq, sql } from "drizzle-orm";

export async function GET() {
    const session = await auth();
    const userId = session?.user?.id;

    // Verify admin
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        // Count stats
        // Drizzle counts via sql
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [opinionCount] = await db.select({ count: sql<number>`count(*)` }).from(opinions);
        const [reportCount] = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.status, "pending"));
        const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);

        return NextResponse.json({
            totalUsers: Number(userCount.count),
            totalOpinions: Number(opinionCount.count),
            pendingReports: Number(reportCount.count),
            categories: Number(categoryCount.count)
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
