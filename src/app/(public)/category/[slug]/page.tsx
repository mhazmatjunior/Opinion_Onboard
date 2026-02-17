import { notFound } from "next/navigation";
import { CategoryClientPage } from "@/components/pages/CategoryClientPage";
import { db } from "@/db";
import { categories, opinions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth } from "@/auth";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    const category = await db.query.categories.findFirst({
        where: eq(categories.slug, slug)
    });

    if (!category) {
        notFound();
    }

    const categoryOpinions = await db.query.opinions.findMany({
        where: eq(opinions.categoryId, category.id),
        orderBy: [desc(opinions.createdAt)],
        with: {
            author: true,
            votes: true,
            category: true,
            comments: true
        }
    });

    const session = await auth();
    const userId = session?.user?.id;

    const formattedOpinions = categoryOpinions.map((op: typeof categoryOpinions[number]) => {
        const upvotes = op.votes.filter((v) => v.type === 'up').length;
        const downvotes = op.votes.filter((v) => v.type === 'down').length;

        const userVoteRecord = userId ? op.votes.find((v) => v.userId === userId) : undefined;
        const userVote = userVoteRecord ? userVoteRecord.type as "up" | "down" : null;

        return {
            id: op.id,
            content: op.content,
            isAnonymous: op.isAnonymous,
            authorName: op.isAnonymous ? "Anonymous" : (op.author.name ?? undefined),
            voteScore: upvotes - downvotes,
            timestamp: new Date(op.createdAt).toLocaleDateString(),
            categoryId: op.category.id, // Should match category.id
            categoryName: op.category.name,
            authorId: op.author.id,
            userVote,
            commentCount: op.comments.length
        };
    }).sort((a, b) => b.voteScore - a.voteScore);

    const categoryWithCount = {
        ...category,
        opinionCount: categoryOpinions.length
    };

    return <CategoryClientPage category={categoryWithCount} opinions={formattedOpinions} />;
}
