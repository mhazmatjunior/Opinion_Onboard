import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports, users, opinions, votes, comments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const allReports = await db.query.reports.findMany({
            with: {
                reporter: true,
                opinion: true
            }
        });
        // Flatten for UI if needed or return structure
        return NextResponse.json(allReports);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

const actionSchema = z.object({
    action: z.enum(["dismiss", "delete_opinion", "ban_user", "dismiss_all"]),
    reportId: z.string(),
});

export async function POST(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await request.json();
        const { action, reportId } = actionSchema.parse(body);

        const report = await db.query.reports.findFirst({ where: eq(reports.id, reportId) });
        if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

        if (action === "dismiss") {
            await db.update(reports).set({ status: "dismissed" }).where(eq(reports.id, reportId));
        } else if (action === "dismiss_all") {
            // Dismiss all reports for this opinion
            await db.update(reports).set({ status: "dismissed" }).where(eq(reports.opinionId, report.opinionId));
        } else if (action === "delete_opinion") {
            // Delete the opinion and let DB handle cascade
            await db.delete(opinions).where(eq(opinions.id, report.opinionId));
        } else if (action === "ban_user") {
            // Fetch opinion to get authorId
            const targetOpinion = await db.query.opinions.findFirst({
                where: eq(opinions.id, report.opinionId),
            });

            if (targetOpinion) {
                // 1. Ban the author
                await db.update(users)
                    .set({ isBanned: true })
                    .where(eq(users.id, targetOpinion.authorId));

                // 2. Delete the offending opinion
                await db.delete(opinions).where(eq(opinions.id, report.opinionId));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
