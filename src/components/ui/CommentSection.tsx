"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Send, MoreHorizontal, Flag, User as UserIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportModal } from "./ReportModal";

interface Comment {
    id: string;
    content: string;
    authorName: string;
    authorId: string;
    isAnonymous?: boolean;
    createdAt: string;
}

interface CommentSectionProps {
    opinionId: string;
    onCommentPosted?: () => void;
}

export function CommentSection({ opinionId, onCommentPosted }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetchComments();
    }, [opinionId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/opinions/${opinionId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/opinions/${opinionId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    isAnonymous
                })
            });

            if (res.ok) {
                const comment = await res.json();

                const formattedComment: Comment = {
                    id: comment.id,
                    content: comment.content,
                    authorName: isAnonymous ? "Anonymous" : (user.name || "Unknown"),
                    authorId: user.id,
                    isAnonymous: isAnonymous,
                    createdAt: comment.createdAt
                };
                setComments([formattedComment, ...comments]);
                setNewComment("");
                setIsAnonymous(false);
                if (onCommentPosted) onCommentPosted();
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">Loading comments...</div>;

    return (
        <div className="border-t border-border bg-muted/30 p-4 space-y-4 animate-in slide-in-from-top-2">
            {/* Comment Form */}
            <div className="space-y-2">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Write a comment..." : "Log in to comment"}
                        className="flex-1 p-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                {user && (
                    <div className="flex items-center gap-2 px-1">
                        <input
                            type="checkbox"
                            id="anon-comment"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-3.5 h-3.5 accent-primary cursor-pointer"
                        />
                        <label htmlFor="anon-comment" className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors select-none">
                            Post Anonymously
                        </label>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 text-sm group relative">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                {comment.isAnonymous ? <ShieldCheck className="w-4 h-4 opacity-70" /> : <UserIcon className="w-4 h-4" />}
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={cn(
                                            "font-semibold truncate",
                                            comment.isAnonymous ? "text-muted-foreground" : "text-foreground"
                                        )}>
                                            {comment.authorName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="relative shrink-0">
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                                            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        {activeMenuId === comment.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActiveMenuId(null)}
                                                />
                                                <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            if (!user) {
                                                                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                                                                return;
                                                            }
                                                            setReportingCommentId(comment.id);
                                                            setIsReportModalOpen(true);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-muted flex items-center gap-2"
                                                    >
                                                        <Flag className="w-3.5 h-3.5" />
                                                        Report
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed break-words">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        No comments yet.
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReportingCommentId(null);
                }}
                opinionId={opinionId}
                commentId={reportingCommentId}
            />
        </div>
    );
}
