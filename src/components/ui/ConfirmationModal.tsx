"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    loading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200",
            isOpen ? "opacity-100" : "opacity-0"
        )}>
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />
            <div className={cn(
                "relative bg-card w-full max-w-md rounded-lg border border-border shadow-lg flex flex-col transition-all duration-200",
                isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
            )}>
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            variant === "danger" && "bg-danger/10 text-danger",
                            variant === "warning" && "bg-warning/10 text-warning",
                            variant === "info" && "bg-primary/10 text-primary"
                        )}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                    </div>
                    <button
                        onClick={!loading ? onClose : undefined}
                        className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2",
                            variant === "danger" && "bg-danger text-white hover:bg-danger/90",
                            variant === "warning" && "bg-warning text-white hover:bg-warning/90",
                            variant === "info" && "bg-primary text-primary-foreground hover:bg-primary/90",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
