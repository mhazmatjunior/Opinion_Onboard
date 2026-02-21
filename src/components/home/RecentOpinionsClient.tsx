"use client";

import { useState, useEffect } from "react";
import { OpinionCard } from "@/components/ui/OpinionCard";
import { ReportModal } from "@/components/ui/ReportModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { TrendingUp, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentOpinionsClientProps {
    opinions: any[];
    categorySlug?: string;
    showSort?: boolean;
}

export function RecentOpinionsClient({ opinions: initialOpinions, categorySlug, showSort = true }: RecentOpinionsClientProps) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingOpinionId, setReportingOpinionId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'latest' | 'top'>('latest');
    const [displayOpinions, setDisplayOpinions] = useState(initialOpinions);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Fetch opinions when sort changes (unless it's the first render with initial data)
    useEffect(() => {
        const fetchSortedOpinions = async () => {
            setIsLoading(true);
            try {
                const url = new URL("/api/opinions", window.location.origin);
                url.searchParams.set("sort", sortBy);
                if (categorySlug) {
                    url.searchParams.set("category", categorySlug);
                }

                const res = await fetch(url.toString());
                if (res.ok) {
                    const data = await res.json();
                    setDisplayOpinions(data);
                }
            } catch (error) {
                console.error("Failed to fetch sorted opinions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Don't fetch on initial load if we have opinions and sort is latest (initial server render)
        if (sortBy !== 'latest' || categorySlug) {
            fetchSortedOpinions();
        } else if (initialOpinions !== displayOpinions) {
            // If initialOpinions changes from outside (props)
            setDisplayOpinions(initialOpinions);
        }
    }, [sortBy, categorySlug, initialOpinions]);

    const handleReport = (opinionId: string) => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setReportingOpinionId(opinionId);
        setIsReportModalOpen(true);
    };

    return (
        <>
            {showSort && (
                <div className="flex items-center gap-2 mb-8 bg-muted/50 p-1 rounded-xl w-fit border border-border">
                    <button
                        onClick={() => setSortBy('latest')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            sortBy === 'latest'
                                ? "bg-background text-primary shadow-sm border border-border"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Clock className="w-4 h-4" />
                        Latest
                    </button>
                    <button
                        onClick={() => setSortBy('top')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            sortBy === 'top'
                                ? "bg-background text-primary shadow-sm border border-border"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Top Voted
                    </button>
                </div>
            )}

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-x-0 -top-4 flex justify-center z-10">
                        <div className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border shadow-sm flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin text-primary" />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Updating...</span>
                        </div>
                    </div>
                )}

                <div className={cn("space-y-6 transition-opacity", isLoading && "opacity-50")}>
                    {displayOpinions.length === 0 ? (
                        <div className="p-12 text-center bg-card border border-dashed border-border rounded-2xl">
                            <p className="text-muted-foreground">No opinions found here yet.</p>
                        </div>
                    ) : (
                        displayOpinions.map((opinion) => (
                            <OpinionCard
                                key={opinion.id}
                                opinion={opinion}
                                onReport={() => handleReport(opinion.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReportingOpinionId(null);
                }}
                opinionId={reportingOpinionId}
            />
        </>
    );
}
