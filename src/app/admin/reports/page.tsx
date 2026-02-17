import { db } from "@/db";
import { reports } from "@/db/schema";
import { desc, ne } from "drizzle-orm";
import { AdminReportsList } from "@/components/admin/AdminReportsList";

export const dynamic = 'force-dynamic';

interface GroupedReport {
    opinionId: string;
    opinionContent: string;
    opinionIsAnonymous: boolean;
    opinionAuthorId: string;
    opinionAuthorName: string | null;
    reports: {
        id: string;
        reporter: string;
        reason: string;
        details: string | null;
        timestamp: string;
        status: string;
    }[];
    status: string;
}

export default async function AdminReportsPage() {
    const reportsData = await db.query.reports.findMany({
        where: ne(reports.status, "dismissed"),
        orderBy: [desc(reports.createdAt)],
        with: {
            reporter: true,
            opinion: {
                with: {
                    author: true
                }
            }
        }
    });

    const groupedReports = reportsData.reduce<Record<string, GroupedReport>>((acc, report) => {
        if (!acc[report.opinionId]) {
            acc[report.opinionId] = {
                opinionId: report.opinionId,
                opinionContent: report.opinion.content,
                opinionIsAnonymous: report.opinion.isAnonymous,
                opinionAuthorId: report.opinion.authorId,
                opinionAuthorName: report.opinion.author.name,
                reports: [],
                status: 'pending'
            };
        }
        acc[report.opinionId].reports.push({
            id: report.id,
            reporter: report.reporter.name,
            reason: report.reason,
            details: report.details,
            timestamp: new Date(report.createdAt).toLocaleString(),
            status: report.status
        });

        return acc;
    }, {});

    const aggregatedReports = Object.values(groupedReports);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <div className="flex bg-muted p-1 rounded-lg">
                    <button className="px-4 py-1.5 bg-background shadow-sm rounded-md text-sm font-medium">All</button>
                    {/* Filter logic could be added here later */}
                </div>
            </div>

            <AdminReportsList reports={aggregatedReports} />
        </div>
    );
}
