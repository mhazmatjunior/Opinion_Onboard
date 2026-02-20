"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Send, MoreHorizontal, Flag, User as UserIcon, ShieldCheck, MessageSquare, Pencil, Trash2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportModal } from "./ReportModal";
import { ConfirmationModal } from "./ConfirmationModal";

interface Comment {
    id: string;
    content: string;
    authorName: string;
    authorId: string;
    isAnonymous?: boolean;
    createdAt: string;
    parentId?: string | null;
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
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;
        const anon = parentId ? isReplyAnonymous : isAnonymous;

        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/opinions/${opinionId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content,
                    isAnonymous: anon,
                    parentId: parentId
                })
            });

            if (res.ok) {
                const comment = await res.json();

                const formattedComment: Comment = {
                    id: comment.id,
                    content: comment.content,
                    authorName: anon ? "Anonymous" : (user.name || "Unknown"),
                    authorId: user.id,
                    isAnonymous: anon,
                    createdAt: comment.createdAt,
                    parentId: parentId
                };
                setComments([formattedComment, ...comments]);

                if (parentId) {
                    setReplyContent("");
                    setReplyingToId(null);
                    setIsReplyAnonymous(false);
                } else {
                    setNewComment("");
                    setIsAnonymous(false);
                }

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
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length > 0 ? (
                    // Filter top-level comments and render them
                    comments.filter(c => !c.parentId).map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            allComments={comments}
                            user={user}
                            submitting={submitting}
                            replyingToId={replyingToId}
                            setReplyingToId={setReplyingToId}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            isReplyAnonymous={isReplyAnonymous}
                            setIsReplyAnonymous={setIsReplyAnonymous}
                            handleSubmit={handleSubmit}
                            setActiveMenuId={setActiveMenuId}
                            activeMenuId={activeMenuId}
                            setIsReportModalOpen={setIsReportModalOpen}
                            setReportingCommentId={setReportingCommentId}
                            router={router}
                            pathname={pathname}
                        />
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

interface CommentItemProps {
    comment: Comment;
    allComments: Comment[];
    user: any;
    submitting: boolean;
    replyingToId: string | null;
    setReplyingToId: (id: string | null) => void;
    replyContent: string;
    setReplyContent: (content: string) => void;
    isReplyAnonymous: boolean;
    setIsReplyAnonymous: (anon: boolean) => void;
    handleSubmit: (e: React.FormEvent, parentId: string | null) => Promise<void>;
    setActiveMenuId: (id: string | null) => void;
    activeMenuId: string | null;
    setIsReportModalOpen: (open: boolean) => void;
    setReportingCommentId: (id: string | null) => void;
    router: any;
    pathname: string;
    depth?: number;
}

function CommentItem({
    comment,
    allComments,
    user,
    submitting,
    replyingToId,
    setReplyingToId,
    replyContent,
    setReplyContent,
    isReplyAnonymous,
    setIsReplyAnonymous,
    handleSubmit,
    setActiveMenuId,
    activeMenuId,
    setIsReportModalOpen,
    setReportingCommentId,
    router,
    pathname,
    depth = 0
}: CommentItemProps) {
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [localContent, setLocalContent] = useState(comment.content);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const replies = allComments.filter(c => c.parentId === comment.id);
    const isReplying = replyingToId === comment.id;
    const isAuthor = user?.id === comment.authorId;

    const handleUpdate = async () => {
        if (!editedContent.trim() || editedContent === localContent) {
            setIsEditing(false);
            return;
        }

        try {
            const res = await fetch(`/api/comments/${comment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });

            if (res.ok) {
                setLocalContent(editedContent);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to update comment", err);
        }
    };

    const handleDelete = async () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/comments/${comment.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setIsDeleted(true);
            }
        } catch (err) {
            console.error("Failed to delete comment", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isDeleted) return null;

    return (
        <div className={cn("space-y-3", depth > 0 && "ml-6 border-l border-border/50 pl-4")}>
            <div className="flex gap-3 text-sm group relative">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                    {comment.isAnonymous ? <ShieldCheck className="w-4 h-4 opacity-70" /> : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
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

                        <div className="relative shrink-0 flex items-center gap-1">
                            {user && depth < 2 && ( // Limit nesting depth to 2 for sanity
                                <button
                                    onClick={() => {
                                        if (isReplying) {
                                            setReplyingToId(null);
                                        } else {
                                            setReplyingToId(comment.id);
                                            setReplyContent("");
                                        }
                                    }}
                                    className="text-[10px] font-medium text-primary hover:underline px-2 py-0.5"
                                >
                                    Reply
                                </button>
                            )}
                            {replies.length > 0 && (
                                <button
                                    onClick={() => setIsRepliesOpen(!isRepliesOpen)}
                                    className={cn(
                                        "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 transition-colors",
                                        isRepliesOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{replies.length}</span>
                                </button>
                            )}
                            <button
                                onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                                className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
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
                                        {isAuthor ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        setIsEditing(true);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted flex items-center gap-2"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        handleDelete();
                                                    }}
                                                    disabled={isDeleting}
                                                    className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-muted flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
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
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="space-y-2 py-1">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedContent(localContent);
                                    }}
                                    className="p-1 px-2 text-[10px] rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={!editedContent.trim() || editedContent === localContent}
                                    className="p-1 px-2 text-[10px] rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Check className="w-3 h-3" /> Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground leading-relaxed break-words">
                            {localContent}
                        </p>
                    )}

                    {/* Reply Form */}
                    {isReplying && (
                        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <form
                                onSubmit={(e) => handleSubmit(e, comment.id)}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    autoFocus
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.authorName}...`}
                                    className="flex-1 p-1.5 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    disabled={submitting}
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !replyContent.trim()}
                                    className="p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                            <div className="flex items-center gap-2 px-1">
                                <input
                                    type="checkbox"
                                    id={`anon-reply-${comment.id}`}
                                    checked={isReplyAnonymous}
                                    onChange={(e) => setIsReplyAnonymous(e.target.checked)}
                                    className="w-3 h-3 accent-primary cursor-pointer"
                                />
                                <label
                                    htmlFor={`anon-reply-${comment.id}`}
                                    className="text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors select-none"
                                >
                                    Post Anonymously
                                </label>
                                <button
                                    onClick={() => setReplyingToId(null)}
                                    className="ml-auto text-[10px] text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recursive Replies */}
            {isRepliesOpen && replies.length > 0 && (
                <div className="space-y-4 pt-1 animate-in slide-in-from-top-1 duration-200">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            user={user}
                            submitting={submitting}
                            replyingToId={replyingToId}
                            setReplyingToId={setReplyingToId}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            isReplyAnonymous={isReplyAnonymous}
                            setIsReplyAnonymous={setIsReplyAnonymous}
                            handleSubmit={handleSubmit}
                            setActiveMenuId={setActiveMenuId}
                            activeMenuId={activeMenuId}
                            setIsReportModalOpen={setIsReportModalOpen}
                            setReportingCommentId={setReportingCommentId}
                            router={router}
                            pathname={pathname}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This will also remove all its replies. This action cannot be undone."
                confirmText="Delete Comment"
                isLoading={isDeleting}
            />
        </div>
    );
}
