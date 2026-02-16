import { stats } from "@/lib/mockData";
import { Users, FileText, Flag, Layers, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
                            <h3 className="text-2xl font-bold">{stats.pendingReports}</h3>
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

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold">Recent Activity</h3>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                            <div>
                                <p className="text-sm font-medium">New opinion posted in <span className="text-foreground">Technology Industry</span></p>
                                <p className="text-xs text-muted-foreground">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-danger" />
                            <div>
                                <p className="text-sm font-medium">Report filed against opinion #2394</p>
                                <p className="text-xs text-muted-foreground">15 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-success" />
                            <div>
                                <p className="text-sm font-medium">New user registration: <span className="text-foreground">alex_p</span></p>
                                <p className="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
