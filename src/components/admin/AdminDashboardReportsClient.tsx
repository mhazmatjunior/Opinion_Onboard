"use client";

import { useState } from "react";
import { Flag, Eye } from "lucide-react";
import { ReportActions } from "@/components/admin/ReportActions";
import { cn } from "@/lib/utils";

interface DashboardReport {
    id: string;
    opinionId: string;
    reason: string;
    status: string;
    createdAt: string;
    reporter: {
        name: string | null;
    };
    opinion: {
        content: string;
        isAnonymous: boolean;
        author: {
            name: string | null;
        };
    };
}

interface AdminDashboardReportsClientProps {
    reports: DashboardReport[];
}

export function AdminDashboardReportsClient({ reports }: AdminDashboardReportsClientProps) {
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">Recent Reports</h3>
                </div>
            </div>
            <div className="p-6">
                {reports.length > 0 ? (
                    <div className="space-y-4">
                        {reports.map(report => (
                            <div key={report.id} className="p-3 bg-muted/10 rounded-md border border-border/30 text-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                    <span className="font-medium text-danger">{report.reason}</span>
                                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                        {new Date(report.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-muted-foreground">by <span className="text-foreground">{report.reporter.name}</span></p>
                                {report.opinion.content && (
                                    <p className="mt-1 text-muted-foreground italic truncate">"{report.opinion.content}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">No recent reports found.</div>
                )}
            </div>
        </div>
    );
}
