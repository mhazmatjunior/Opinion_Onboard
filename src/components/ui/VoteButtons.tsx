"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
    score: number;
    userVote?: "up" | "down" | null;
    className?: string;
}

export function VoteButtons({ score, userVote = null, className }: VoteButtonsProps) {
    return (
        <div className={cn("flex flex-col items-center space-y-1", className)}>
            <button
                className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    userVote === "up" ? "text-primary" : "text-muted-foreground"
                )}
                aria-label="Upvote"
            >
                <ChevronUp className="w-6 h-6" />
            </button>

            <span className={cn(
                "font-semibold text-sm",
                userVote === "up" ? "text-primary" :
                    userVote === "down" ? "text-danger" : "text-foreground"
            )}>
                {score}
            </span>

            <button
                className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    userVote === "down" ? "text-danger" : "text-muted-foreground"
                )}
                aria-label="Downvote"
            >
                <ChevronDown className="w-6 h-6" />
            </button>
        </div>
    );
}
