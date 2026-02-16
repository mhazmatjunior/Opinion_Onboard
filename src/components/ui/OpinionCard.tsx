"use client";

import { useState } from "react";
import { MoreHorizontal, MessageSquare, Share2, Flag } from "lucide-react";
import { Opinion } from "@/lib/mockData";
import { VoteButtons } from "./VoteButtons";
import { cn } from "@/lib/utils";

interface OpinionCardProps {
    opinion: Opinion;
    className?: string;
    onReport?: () => void;
}

export function OpinionCard({ opinion, className, onReport }: OpinionCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={cn("bg-card border border-border rounded-lg p-5 flex gap-4 transition-all hover:border-border/80", className)}>
            {/* Vote Section */}
            <div className="shrink-0">
                <VoteButtons score={opinion.voteScore} />
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 relative">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={cn("font-medium", !opinion.isAnonymous && "text-primary")}>
                            {opinion.isAnonymous ? "Posted Anonymously" : opinion.authorName}
                        </span>
                        <span>•</span>
                        <span>{opinion.timestamp}</span>
                        {opinion.categoryName && (
                            <>
                                <span>•</span>
                                <span className="font-medium text-foreground">{opinion.categoryName}</span>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            aria-label="Options"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-8 z-20 w-32 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onReport?.();
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-muted flex items-center gap-2"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-foreground text-base leading-relaxed mb-4 break-words">
                    {opinion.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
