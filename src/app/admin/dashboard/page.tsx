import { Users, FileText, Flag, Layers } from "lucide-react";
import { db } from "@/db";
import { users, opinions, reports, categories } from "@/db/schema";
import { eq, sql, desc, ne } from "drizzle-orm";
// ReportActions is no longer needed directly here
import { AdminDashboardReportsClient } from "@/components/admin/AdminDashboardReportsClient";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Auth check moved to layout.tsx

    // Fetch Stats
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [opinionCount] = await db.select({ count: sql<number>`count(*)` }).from(opinions);
    // Only pending reports count for the stats
    const [reportCount] = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.status, "pending"));
    const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);

    const stats = {
        totalUsers: Number(userCount.count),
        totalOpinions: Number(opinionCount.count),
        pendingReports: Number(reportCount.count),
        categoriesCount: Number(categoryCount.count),
    };

    // Fetch Recent Reports for Activity
    const recentReports = await db.query.reports.findMany({
        where: ne(reports.status, "dismissed"),
        orderBy: [desc(reports.createdAt)],
        limit: 5,
        with: {
            reporter: true,
            opinion: {
                with: {
                    author: true
                }
            }
        }
    });

    return (
        <div className="space-y-6 container-custom py-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your platform and community</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Opinions</p>
                            <h3 className="text-2xl font-bold">{stats.totalOpinions.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-danger/10 rounded-lg text-danger">
                            <Flag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                            <h3 className="text-2xl font-bold text-danger">{stats.pendingReports}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-warning/10 rounded-lg text-warning">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Categories</p>
                            <h3 className="text-2xl font-bold">{stats.categoriesCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports Table/List */}
            <AdminDashboardReportsClient reports={recentReports.map(r => ({
                ...r,
                createdAt: r.createdAt.toString(),
                status: r.status || 'pending',
                reporter: { name: r.reporter.name || 'Unknown' },
                opinion: {
                    ...r.opinion,
                    author: { name: r.opinion.author.name || 'Unknown' }
                }
            }))} />
        </div>
    );
}
