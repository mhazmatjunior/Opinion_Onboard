"use client";

import { X, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message?: string;
    description?: string; // Alias for compatibility
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    loading?: boolean; // Alias for compatibility
    variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
    loading = false,
    variant = "danger"
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const displayMessage = message || description;
    const isWorking = isLoading || loading;

    const variantStyles = {
        danger: "bg-danger text-white hover:bg-danger/90",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-primary text-primary-foreground hover:bg-primary/90"
    };

    const iconStyles = {
        danger: "bg-danger/10 text-danger",
        warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        info: "bg-primary/10 text-primary"
    };

    const Icon = variant === "danger" ? Trash2 : (variant === "warning" ? AlertTriangle : AlertTriangle);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-card w-full max-w-md rounded-lg shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-full", iconStyles[variant])}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                        {displayMessage}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isWorking}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isWorking}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50",
                            variantStyles[variant]
                        )}
                    >
                        {isWorking ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
