"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PostOpinionModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryName?: string;
    categoryId?: string;
}

export function PostOpinionModal({ isOpen, onClose, categoryName, categoryId }: PostOpinionModalProps) {
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const maxLength = 500;

    if (!isOpen) return null;

    const handlePost = async () => {
        if (!content.trim()) return;
        if (!categoryId) {
            setError("Category is missing.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/opinions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    isAnonymous,
                    categoryId
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to post opinion");
            }

            setContent("");
            setIsAnonymous(false);
            onClose();
            router.refresh(); // Refresh specific route to show new post
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-card w-full max-w-lg rounded-lg shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Post Your Opinion</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {categoryName && (
                        <div className="text-sm text-muted-foreground">
                            Posting in <span className="font-medium text-foreground">{categoryName}</span>
                        </div>
                    )}

                    {error && <div className="text-sm text-red-500">{error}</div>}

                    <div className="space-y-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your perspective..."
                            className="w-full min-h-[150px] p-3 rounded-md border border-border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                            maxLength={maxLength}
                            disabled={loading}
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                            {content.length}/{maxLength} characters
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="sr-only peer"
                                    disabled={loading}
                                />
                                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                            <span className="text-sm font-medium">Post Anonymously</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={loading || !content.trim()}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? "Posting..." : "Post Opinion"}
                    </button>
                </div>
            </div>
        </div>
    );
}
