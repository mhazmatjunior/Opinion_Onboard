"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Send, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    id: string;
    content: string;
    authorName: string;
    authorId: string;
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
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const comment = await res.json();

                const formattedComment: Comment = {
                    id: comment.id,
                    content: comment.content,
                    authorName: user.name || "Anonymous",
                    authorId: user.id,
                    createdAt: comment.createdAt
                };
                setComments([formattedComment, ...comments]);
                setNewComment("");
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

            {/* Comments List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{comment.authorName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                        No comments yet.
                    </div>
                )}
            </div>
        </div>
    );
}
