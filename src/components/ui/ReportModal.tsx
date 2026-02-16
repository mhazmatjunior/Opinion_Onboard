"use client";

import { useState } from "react";
import { X, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [reason, setReason] = useState("spam");
    const [details, setDetails] = useState("");

    if (!isOpen) return null;

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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2.5 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-danger text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-danger/90 transition-colors shadow-sm text-white"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
}
