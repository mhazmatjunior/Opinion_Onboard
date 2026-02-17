"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface VoteButtonsProps {
    score: number;
    userVote?: "up" | "down" | null; // This userVote prop comes from server if user is logged in
    opinionId: string;
    className?: string;
}

export function VoteButtons({ score, userVote = null, opinionId, className }: VoteButtonsProps) {
    const { user } = useAuth();
    const [currentScore, setCurrentScore] = useState(score);
    const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(userVote);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Sync state with props if they change from server
    useEffect(() => {
        if (!loading) {
            setCurrentScore(score);
            setCurrentVote(userVote);
        }
    }, [score, userVote, loading]);

    const handleVote = async (type: "up" | "down") => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (loading) return;

        // Optimistic UI update
        const previousVote = currentVote;
        const previousScore = currentScore;

        let newVote = type;
        if (currentVote === type) {
            newVote = null!; // Toggle off (ts hack or just null)
        }

        // Calculate new score locally
        let scoreChange = 0;
        if (currentVote === type) {
            // Removing vote
            scoreChange = type === "up" ? -1 : 1;
        } else if (currentVote) {
            // Changing vote (e.g. up -> down)
            scoreChange = type === "up" ? 2 : -2;
        } else {
            // New vote
            scoreChange = type === "up" ? 1 : -1;
        }

        setCurrentVote(currentVote === type ? null : type);
        setCurrentScore(currentScore + scoreChange);
        setLoading(true);

        try {
            const res = await fetch(`/api/opinions/${opinionId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type })
            });

            if (!res.ok) {
                throw new Error("Failed to vote");
            }
        } catch (error) {
            // Revert on error
            setCurrentVote(previousVote);
            setCurrentScore(previousScore);
            console.error(error);
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    return (
        <div className={cn("flex flex-col items-center space-y-1", className)}>
            <button
                onClick={() => handleVote("up")}
                disabled={loading}
                className={cn(
                    "p-1 rounded hover:bg-muted transition-colors disabled:opacity-50",
                    currentVote === "up" ? "text-primary" : "text-muted-foreground"
                )}
                aria-label="Upvote"
            >
                <ChevronUp className="w-6 h-6" />
            </button>

            <span className={cn(
                "font-semibold text-sm",
                currentVote === "up" ? "text-primary" :
                    currentVote === "down" ? "text-danger" : "text-foreground"
            )}>
                {currentScore}
            </span>

            <button
                onClick={() => handleVote("down")}
                disabled={loading}
                className={cn(
                    "p-1 rounded hover:bg-muted transition-colors disabled:opacity-50",
                    currentVote === "down" ? "text-danger" : "text-muted-foreground"
                )}
                aria-label="Downvote"
            >
                <ChevronDown className="w-6 h-6" />
            </button>
        </div>
    );
}
