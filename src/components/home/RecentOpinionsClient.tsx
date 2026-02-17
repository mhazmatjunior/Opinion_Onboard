"use client";

import { useState } from "react";
import { OpinionCard } from "@/components/ui/OpinionCard";
import { ReportModal } from "@/components/ui/ReportModal";
// We need to import Opinion type. Assuming it's compatible with what's passed from page.tsx
// Since page.tsx constructs the object, we might need a loose type or share the interface.
// For now, I will define a compatible interface or use 'any' if types are complex, 
// but better to stick to the structure used in OpinionCard props which expects 'Opinion'.
import { Opinion } from "@/lib/mockData"; // Verify if this is the shared type
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface RecentOpinionsClientProps {
    opinions: any[]; // Using any[] temporarily to match the mapped object from page.tsx. Ideally should be Opinion[]
}

export function RecentOpinionsClient({ opinions }: RecentOpinionsClientProps) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingOpinionId, setReportingOpinionId] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleReport = (opinionId: string) => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setReportingOpinionId(opinionId);
        setIsReportModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                {opinions.map((opinion) => (
                    <OpinionCard
                        key={opinion.id}
                        opinion={opinion}
                        onReport={() => handleReport(opinion.id)}
                    />
                ))}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReportingOpinionId(null);
                }}
                opinionId={reportingOpinionId}
            />
        </>
    );
}
