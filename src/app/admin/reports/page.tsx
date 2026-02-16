import { Flag, Trash2, Ban, CheckCircle } from "lucide-react";

// Mock reports data
const reports = [
    {
        id: "r1",
        opinionContent: "This opinion contains hate speech against a specific group...",
        reporter: "user_123",
        reason: "Harassment",
        details: "Using slurs in the second paragraph.",
        timestamp: "2 hours ago",
        status: "Pending"
    },
    {
        id: "r2",
        opinionContent: "Buy cheap enhancement pills at...",
        reporter: "anon_user",
        reason: "Spam",
        details: "Commercial linkspam.",
        timestamp: "5 hours ago",
        status: "Pending"
    },
    {
        id: "r3",
        opinionContent: "The election was stolen! I have proof...",
        reporter: "citizen_jane",
        reason: "False Information",
        details: "Repeating debunked conspiracy theories.",
        timestamp: "1 day ago",
        status: "Reviewed"
    }
];

export default function AdminReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <div className="flex bg-muted p-1 rounded-lg">
                    <button className="px-4 py-1.5 bg-background shadow-sm rounded-md text-sm font-medium">Pending</button>
                    <button className="px-4 py-1.5 text-muted-foreground text-sm font-medium hover:text-foreground">Reviewed</button>
                    <button className="px-4 py-1.5 text-muted-foreground text-sm font-medium hover:text-foreground">Dismissed</button>
                </div>
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="bg-card rounded-lg border border-border p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-danger/10 text-danger text-xs font-medium border border-danger/20">
                                            {report.reason}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            Reported by <span className="font-medium text-foreground">{report.reporter}</span> • {report.timestamp}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                                    <p className="text-sm font-medium mb-1 text-muted-foreground">Reported Content:</p>
                                    <p className="text-sm italic">"{report.opinionContent}"</p>
                                </div>

                                {report.details && (
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">Details: </span>
                                        {report.details}
                                    </p>
                                )}
                            </div>

                            <div className="flex md:flex-col gap-2 md:w-48 shrink-0 justify-center md:border-l md:border-border md:pl-6">
                                <button className="bg-background border border-border hover:bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Dismiss
                                </button>
                                <button className="bg-danger text-danger-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-danger/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                                <button className="text-danger hover:underline text-xs text-center mt-2 flex items-center justify-center gap-1">
                                    <Ban className="w-3 h-3" />
                                    Ban User
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
