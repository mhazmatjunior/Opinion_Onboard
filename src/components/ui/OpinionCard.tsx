"use client";

import { useState } from "react";
import { MoreHorizontal, MessageSquare, Share2, Flag } from "lucide-react";
import { Opinion } from "@/lib/mockData";
import { VoteButtons } from "./VoteButtons";
import { cn } from "@/lib/utils";

import { CommentSection } from "./CommentSection";
import { useToast } from "@/components/ui/Toast";

interface OpinionCardProps {
    opinion: Opinion;
    className?: string;
    onReport?: () => void;
}

export function OpinionCard({ opinion, className, onReport }: OpinionCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(opinion.commentCount || 0);

    const { toast } = useToast();

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/opinion/${opinion.id}`;
        const shareData = {
            title: `Opinion by ${opinion.isAnonymous ? "Anonymous" : opinion.authorName}`,
            text: opinion.content.substring(0, 100) + "...",
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast("Link copied to clipboard!", "success");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            // Don't toast on user cancel (AbortError)
        }
    };

    const handleCommentPosted = () => {
        setCommentCount((prev) => prev + 1);
    };

    return (
        <div className={cn("bg-card border border-border rounded-lg p-5 flex gap-4 transition-all hover:border-border/80", className)}>
            {/* Vote Section */}
            <div className="shrink-0">
                <VoteButtons score={opinion.voteScore} userVote={opinion.userVote} opinionId={opinion.id} />
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


                </div>

                <p className="text-foreground text-base leading-relaxed mb-4 break-words">
                    {opinion.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <button
                        onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        className={cn(
                            "flex items-center gap-1.5 hover:text-foreground transition-colors",
                            isCommentsOpen && "text-primary font-medium"
                        )}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>{commentCount}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    <div className="relative ml-auto sm:ml-0">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground flex items-center gap-1"
                            aria-label="Options"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 bottom-full mb-2 z-20 w-32 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
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

                {isCommentsOpen && (
                    <CommentSection opinionId={opinion.id} onCommentPosted={handleCommentPosted} />
                )}
            </div>
        </div>
    );
}
