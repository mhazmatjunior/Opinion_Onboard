"use client";

import { useState } from "react";
import { Search, Trash2, Ban, Eye, CheckCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ModerationOpinion {
    id: string;
    content: string;
    authorName: string;
    authorId: string;
    isAnonymous: boolean;
    categoryName: string;
    timestamp: string;
    voteScore: number;
}

interface ModerationQueueClientProps {
    initialOpinions: ModerationOpinion[];
}

export function ModerationQueueClient({ initialOpinions }: ModerationQueueClientProps) {
    const [opinions, setOpinions] = useState(initialOpinions);
    const [loading, setLoading] = useState<string | null>(null); // "id-action"
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const router = useRouter();

    const handleAction = async (id: string, action: "approve" | "delete" | "ban") => {
        setLoading(`${id}-${action}`);
        try {
            const res = await fetch("/api/admin/moderation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ opinionId: id, action })
            });

            if (!res.ok) throw new Error("Action failed");

            // Optimistic update: Remove from list
            setOpinions(prev => prev.filter(op => op.id !== id));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to perform action");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2">{opinions.length} Pending</span>
                    <button
                        onClick={() => router.refresh()}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        title="Refresh"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {opinions.length > 0 ? (
                    opinions.map((opinion) => (
                        <div key={opinion.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:border-border/80 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="font-medium text-foreground">
                                        {opinion.isAnonymous ? (
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-muted-foreground italic">Anonymous</span>
                                                {revealed[opinion.id] ? (
                                                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border animate-in fade-in">
                                                        {opinion.authorName}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setRevealed(prev => ({ ...prev, [opinion.id]: true }))}
                                                        className="text-xs text-primary hover:underline flex items-center gap-0.5 bg-primary/5 px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Eye className="w-3 h-3" /> Reveal
                                                    </button>
                                                )}
                                            </span>
                                        ) : (
                                            opinion.authorName
                                        )}
                                    </span>
                                    <span className="text-muted-foreground hidden sm:inline">•</span>
                                    <span className="text-muted-foreground text-xs sm:text-sm" suppressHydrationWarning>{opinion.timestamp}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] sm:text-xs font-medium border border-border opacity-70">
                                        {opinion.categoryName}
                                    </span>
                                </div>
                                <div className="text-xs sm:text-sm font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border sm:border-transparent sm:p-0 sm:bg-transparent">
                                    Score: <span className={cn(
                                        opinion.voteScore > 0 ? "text-success" :
                                            opinion.voteScore < 0 ? "text-danger" : ""
                                    )}>{opinion.voteScore}</span>
                                </div>
                            </div>

                            <p className="text-foreground mb-4 leading-relaxed">{opinion.content}</p>

                            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                                <button
                                    onClick={() => handleAction(opinion.id, "approve")}
                                    disabled={!!loading}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                        "text-success hover:bg-success/10",
                                        loading === `${opinion.id}-approve` && "opacity-50"
                                    )}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="inline">Approve</span>
                                </button>

                                <div className="hidden sm:block w-px h-4 bg-border mx-1"></div>

                                <button
                                    onClick={() => handleAction(opinion.id, "ban")}
                                    disabled={!!loading}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                        "text-muted-foreground hover:text-warning hover:bg-warning/10",
                                        loading === `${opinion.id}-ban` && "opacity-50"
                                    )}
                                >
                                    <Ban className="w-4 h-4" />
                                    Ban
                                </button>
                                <button
                                    onClick={() => handleAction(opinion.id, "delete")}
                                    disabled={!!loading}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                        "text-muted-foreground hover:text-danger hover:bg-danger/10",
                                        loading === `${opinion.id}-delete` && "opacity-50"
                                    )}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-border border-dashed">
                        <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">All Caught Up!</h3>
                        <p className="text-muted-foreground">No new opinions in the moderation queue.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
