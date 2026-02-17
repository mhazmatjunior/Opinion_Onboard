"use client";

import { useState } from "react";
import { Check, Trash2, Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface ReportActionsProps {
    reportId: string;
    opinionId: string;
    isGroup?: boolean;
}

export function ReportActions({ reportId, opinionId, isGroup = false }: ReportActionsProps) {
    const [loading, setLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'dismiss' | 'delete_opinion' | null>(null);
    const router = useRouter();

    const handleActionClick = (action: 'dismiss' | 'delete_opinion') => {
        setConfirmAction(action);
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;

        setLoading(true);
        try {
            // If it's a group and we're dismissing, perform 'dismiss_all'
            // If deleting opinion, it's the same regardless (deletes opinion and all reports)
            const apiAction = (confirmAction === 'dismiss' && isGroup) ? 'dismiss_all' : confirmAction;

            const res = await fetch("/api/admin/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, action: apiAction })
            });

            if (!res.ok) {
                throw new Error("Failed to perform action");
            }

            router.refresh();
            setConfirmAction(null);
        } catch (error) {
            console.error(error);
            alert("Action failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <button
                    onClick={() => handleActionClick('dismiss')}
                    disabled={loading}
                    className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-md transition-colors"
                    title="Dismiss Report"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleActionClick('delete_opinion')}
                    disabled={loading}
                    className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                    title="Delete Opinion"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <ConfirmationModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleConfirm}
                title={confirmAction === 'dismiss' ? "Dismiss Report" : "Delete Opinion"}
                description={confirmAction === 'dismiss'
                    ? "Are you sure you want to dismiss this report? The report will be marked as dismissed."
                    : "Are you sure you want to delete this opinion? This will permanently remove the opinion and all associated data. This action cannot be undone."}
                confirmText={confirmAction === 'dismiss' ? "Dismiss" : "Delete Opinion"}
                variant={confirmAction === 'dismiss' ? "info" : "danger"}
                loading={loading}
            />
        </>
    );
}
