"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border animate-in slide-in-from-right-full duration-300",
                            "bg-background text-foreground min-w-[300px]",
                            t.type === "success" && "border-green-500/50 bg-green-50/10",
                            t.type === "error" && "border-red-500/50 bg-red-50/10",
                            t.type === "info" && "border-blue-500/50 bg-blue-50/10"
                        )}
                    >
                        {t.type === "success" && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                        {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
                        {t.type === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0" />}

                        <p className="text-sm font-medium flex-1">{t.message}</p>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
