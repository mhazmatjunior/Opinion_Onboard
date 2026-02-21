import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { opinions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OpinionCard } from "@/components/ui/OpinionCard";
import { cookies } from "next/headers";
import { RecentOpinionsClient } from "@/components/home/RecentOpinionsClient"; // Reusing for report logic

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

async function getOpinion(id: string) {
    try {
        const opinionData = await db.query.opinions.findFirst({
            where: eq(opinions.id, id),
            with: {
                author: true,
                category: true,
                votes: true,
                comments: true
            }
        });
        return opinionData;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const opinion = await getOpinion(id);

    if (!opinion) {
        return {
            title: "Opinion Not Found - Opinion Onboard",
        };
    }

    const title = opinion.isAnonymous
        ? "Anonymous Opinion"
        : `Opinion by ${opinion.author.name}`;

    const description = opinion.content.length > 150
        ? opinion.content.substring(0, 150) + "..."
        : opinion.content;

    return {
        title: `${title} - Opinion Onboard`,
        description,
        openGraph: {
            title: `${title} - Opinion Onboard`,
            description,
            type: "article",
        },
    };
}

export default async function OpinionPage({ params }: PageProps) {
    const { id } = await params;
    const opinion = await getOpinion(id);

    if (!opinion) {
        notFound();
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const upvotes = opinion.votes.filter((v) => v.type === 'up').length;
    const downvotes = opinion.votes.filter((v) => v.type === 'down').length;
    const userVoteRecord = userId ? opinion.votes.find((v) => v.userId === userId) : undefined;
    const userVote = userVoteRecord ? userVoteRecord.type as "up" | "down" : null;

    const formattedOpinion = {
        id: opinion.id,
        content: opinion.content,
        isAnonymous: opinion.isAnonymous,
        authorName: opinion.isAnonymous ? "Anonymous" : opinion.author.name,
        voteScore: upvotes - downvotes,
        timestamp: new Date(opinion.createdAt).toLocaleDateString(),
        categoryId: opinion.category.id,
        categoryName: opinion.category.name,
        authorId: opinion.author.id,
        userVote,
        commentCount: opinion.comments.length
    };

    return (
        <div className="container-custom py-12 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Shared Opinion</h1>
            {/* Reusing RecentOpinionsClient because it wraps OpinionCard with ReportModal/Logic */}
            <RecentOpinionsClient opinions={[formattedOpinion]} />
        </div>
    );
}
