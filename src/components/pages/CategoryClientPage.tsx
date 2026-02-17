"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Category, Opinion } from "@/lib/mockData";
import { OpinionCard } from "@/components/ui/OpinionCard";
import { PostOpinionModal } from "@/components/ui/PostOpinionModal";
import { ReportModal } from "@/components/ui/ReportModal";

interface CategoryClientPageProps {
    category: Category;
    opinions: Opinion[];
}

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function CategoryClientPage({ category, opinions }: CategoryClientPageProps) {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingOpinionId, setReportingOpinionId] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handlePostClick = () => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setIsPostModalOpen(true);
    };

    const handleReport = (opinionId: string) => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setReportingOpinionId(opinionId);
        setIsReportModalOpen(true);
    };

    return (
        <div className="container-custom py-12 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{category.name}</h1>
                    <p className="text-muted-foreground text-lg">{category.description}</p>
                </div>
                <button
                    onClick={handlePostClick}
                    className="shrink-0 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-shadow shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Post Opinion
                </button>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {opinions.length > 0 ? (
                    opinions.map((opinion) => (
                        <OpinionCard
                            key={opinion.id}
                            opinion={opinion}
                            onReport={() => handleReport(opinion.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                        No opinions yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>

            {/* Modals */}
            <PostOpinionModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                categoryName={category.name}
                categoryId={category.id}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => {
                    setIsReportModalOpen(false);
                    setReportingOpinionId(null);
                }}
                opinionId={reportingOpinionId}
            />
        </div>
    );
}
