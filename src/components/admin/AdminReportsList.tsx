"use client";

import { useState } from "react";
import { Eye, Check, Trash2 } from "lucide-react";
import { ReportActions } from "@/components/admin/ReportActions";
import { cn } from "@/lib/utils";

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

interface AdminReportsListProps {
    reports: GroupedReport[];
}

export function AdminReportsList({ reports }: AdminReportsListProps) {
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});

    return (
        <div className="space-y-4">
            {reports.length > 0 ? (
                reports.map((group) => (
                    <div key={group.opinionId} className="bg-card rounded-lg border border-border p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                                    <p className="text-sm font-medium mb-1 text-muted-foreground">Reported Opinion:</p>
                                    <p className="text-sm italic">"{group.opinionContent}"</p>
                                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                        <span>Author:</span>
                                        <span className="font-medium text-foreground">
                                            {group.opinionIsAnonymous ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-muted-foreground">Anonymous</span>
                                                    {revealed[group.opinionId] ? (
                                                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border animate-in fade-in">
                                                            {group.opinionAuthorName}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setRevealed(prev => ({ ...prev, [group.opinionId]: true }))}
                                                            className="text-xs text-primary hover:underline flex items-center gap-0.5 bg-primary/5 px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                                                        >
                                                            <Eye className="w-3 h-3" /> Reveal
                                                        </button>
                                                    )}
                                                </span>
                                            ) : (
                                                group.opinionAuthorName
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-foreground">Reports ({group.reports.length})</p>
                                    {group.reports.map((report) => (
                                        <div key={report.id} className="p-3 bg-muted/10 rounded-md border border-border/30 text-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-danger">{report.reason}</span>
                                                <span className="text-xs text-muted-foreground" suppressHydrationWarning>{report.timestamp}</span>
                                            </div>
                                            <p className="text-muted-foreground">by <span className="text-foreground">{report.reporter}</span></p>
                                            {report.details && (
                                                <p className="mt-1 text-muted-foreground italic">"{report.details}"</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap md:flex-col gap-2 md:w-48 shrink-0 justify-center md:border-l md:border-border md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                                <ReportActions
                                    reportId={group.reports[0].id}
                                    opinionId={group.opinionId}
                                    isGroup={true}
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">No reports found.</div>
            )}
        </div>
    );
}
