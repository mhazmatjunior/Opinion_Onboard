"use client";

import { useState } from "react";
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
import { useToast } from "@/components/ui/Toast";
import { Plus, Share2 } from "lucide-react";

import { RecentOpinionsClient } from "@/components/home/RecentOpinionsClient";

export function CategoryClientPage({ category, opinions }: CategoryClientPageProps) {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const handlePostClick = () => {
        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setIsPostModalOpen(true);
    };

    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? `${window.location.host}${pathname}` : '';
        const shareData = {
            title: `${category.name} - Opinion Onboard`,
            text: `Join the conversation about ${category.name}: ${category.description}`,
            url: `https://${shareUrl}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`https://${shareUrl}`);
                toast("Link copied to clipboard!", "success");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="container-custom py-12 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between items-center text-center md:text-left gap-6 mb-10 pb-8 border-b border-border">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{category.name}</h1>
                    <p className="text-muted-foreground text-lg">{category.description}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleShare}
                        className="flex-1 md:flex-none bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 md:px-2.5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-border shadow-sm"
                        title="Share Category"
                    >
                        <Share2 className="w-5 h-5 shrink-0" />
                        <span className="md:hidden">Share</span>
                    </button>
                    <button
                        onClick={handlePostClick}
                        className="flex-1 md:flex-none bg-primary text-primary-foreground px-4 md:px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-shadow shadow-sm whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5 shrink-0" />
                        Post Opinion
                    </button>
                </div>
            </div>

            {/* Feed */}
            <RecentOpinionsClient
                opinions={opinions}
                categorySlug={category.slug}
            />

            {/* Modals */}
            <PostOpinionModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                categoryName={category.name}
                categoryId={category.id}
            />
        </div>
    );
}
