"use client";

import { useState } from "react";
import { X, Flag, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    opinionId?: string | null;
}

export function ReportModal({ isOpen, onClose, opinionId }: ReportModalProps) {
    const [reason, setReason] = useState("spam");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    if (!isOpen || !opinionId) return null;

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    opinionId,
                    reason,
                    details
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit report");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state after close animation would ideally happen, but here component unmounts likely
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                    onClick={handleClose}
                />
                <div className="relative bg-card w-full max-w-md rounded-lg shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                <Flag className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold">Report Submitted</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-muted-foreground leading-relaxed">
                            Report submitted successfully. Thank you for helping keep our community safe.
                        </p>
                    </div>

                    <div className="flex items-center justify-end p-6 border-t border-border bg-muted/20 rounded-b-lg">
                        <button
                            onClick={handleClose}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-card w-full max-w-md rounded-lg shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-danger/10 rounded-full text-danger hidden sm:block">
                            <Flag className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">Report Opinion</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Thank you for helping keep our community safe. Please tell us why you are reporting this opinion.
                    </p>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2.5 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={loading}
                        >
                            <option value="spam">Spam or unwanted commercial content</option>
                            <option value="harassment">Harassment or hate speech</option>
                            <option value="false_info">False information</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Additional Details (Optional)</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Provide more context..."
                            className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={loading}
                        />
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
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-danger text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-danger/90 transition-colors shadow-sm text-white disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>
        </div>
    );
}
