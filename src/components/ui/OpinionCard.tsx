"use client";

import { useState } from "react";
import { MoreHorizontal, MessageSquare, Share2, Flag, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Opinion } from "@/lib/mockData";
import { VoteButtons } from "./VoteButtons";
import { cn } from "@/lib/utils";

import { CommentSection } from "./CommentSection";
import { useToast } from "@/components/ui/Toast";
import { ConfirmationModal } from "./ConfirmationModal";

interface OpinionCardProps {
    opinion: Opinion;
    className?: string;
    onReport?: () => void;
}

export function OpinionCard({ opinion, className, onReport }: OpinionCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(opinion.commentCount || 0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(opinion.content);
    const [localContent, setLocalContent] = useState(opinion.content);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { user } = useAuth();
    const { toast } = useToast();

    const isAuthor = user?.id === opinion.authorId;

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

    const handleUpdate = async () => {
        if (!editedContent.trim() || editedContent === localContent) {
            setIsEditing(false);
            return;
        }

        try {
            const res = await fetch(`/api/opinions/${opinion.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });

            if (res.ok) {
                setLocalContent(editedContent);
                setIsEditing(false);
                toast("Opinion updated successfully", "success");
            } else {
                toast("Failed to update opinion", "error");
            }
        } catch (err) {
            toast("An error occurred", "error");
        }
    };

    const handleDelete = async () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/opinions/${opinion.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setIsDeleted(true);
                toast("Opinion deleted", "success");
            } else {
                toast("Failed to delete opinion", "error");
            }
        } catch (err) {
            toast("An error occurred", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isDeleted) return null;

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

                {isEditing ? (
                    <div className="mb-4 space-y-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(localContent);
                                }}
                                className="p-1 px-3 text-xs rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={!editedContent.trim() || editedContent === localContent}
                                className="p-1 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                <Check className="w-3 h-3" /> Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-foreground text-base leading-relaxed mb-4 break-words">
                        {localContent}
                    </p>
                )}

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

                    <div className="relative ml-auto">
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
                                    {isAuthor ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsEditing(true);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleDelete();
                                                }}
                                                disabled={isDeleting}
                                                className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-muted flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </>
                                    ) : (
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
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {isCommentsOpen && (
                    <CommentSection opinionId={opinion.id} onCommentPosted={handleCommentPosted} />
                )}

                <ConfirmationModal
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Opinion"
                    message="Are you sure you want to delete this opinion? This will also remove all its comments and votes. This action cannot be undone."
                    confirmText="Delete Opinion"
                    isLoading={isDeleting}
                />
            </div>
        </div>
    );
}
