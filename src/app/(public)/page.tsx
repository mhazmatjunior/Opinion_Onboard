import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { OpinionCard } from "@/components/ui/OpinionCard";
import { db } from "@/db";
import { categories, opinions as OpinionsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { RecentOpinionsClient } from "@/components/home/RecentOpinionsClient";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    // Fetch Categories
    const categoriesData = await db.query.categories.findMany({
        limit: 6,
        with: {
            opinions: true
        }
    });

    const featuredCategories = categoriesData.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        opinionCount: c.opinions.length
    }));

    // Fetch Recent Opinions
    const opinionsData = await db.query.opinions.findMany({
        limit: 5,
        orderBy: [desc(OpinionsTable.createdAt)],
        with: {
            author: true,
            category: true,
            votes: true,
            comments: true
        }
    });

    const session = await auth();
    const userId = session?.user?.id;

    const popularOpinions = opinionsData.map((op: any) => {
        const upvotes = op.votes.filter((v: any) => v.type === 'up').length;
        const downvotes = op.votes.filter((v: any) => v.type === 'down').length;

        const userVoteRecord = userId ? op.votes.find((v: any) => v.userId === userId) : undefined;
        const userVote = userVoteRecord ? userVoteRecord.type as "up" | "down" : null;

        return {
            id: op.id,
            content: op.content,
            isAnonymous: op.isAnonymous,
            authorName: op.isAnonymous ? "Anonymous" : (op.author.name ?? undefined),
            voteScore: upvotes - downvotes,
            timestamp: new Date(op.createdAt).toLocaleDateString(), // Simple formatting
            categoryId: op.category.id,
            categoryName: op.category.name,
            authorId: op.author.id,
            userVote,
            commentCount: op.comments.length
        };
    }).sort((a: any, b: any) => b.voteScore - a.voteScore);

    return (
        <div className="pb-12">
            {/* Hero Section */}
            <section className="bg-background border-b border-border py-20 md:py-32">
                <div className="container-custom text-center max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                        Share Opinions That Matter
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                        Anonymous or named - your voice, your choice. Join the community discussing topics that shape our world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/categories"
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            Browse Categories
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-3 rounded-lg font-medium text-lg border border-border bg-card hover:bg-muted transition-colors text-foreground"
                        >
                            Start Writing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="container-custom py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Featured Categories</h2>
                    <Link href="/categories" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCategories.map((category: any) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </section>

            {/* Popular Opinions */}
            <section className="bg-muted/30 py-16">
                <div className="container-custom max-w-4xl">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Recent Opinions</h2>

                    <RecentOpinionsClient opinions={popularOpinions} />

                    <div className="mt-10 text-center">
                        <Link
                            href="/categories"
                            className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-full text-sm font-medium hover:bg-background transition-colors"
                        >
                            Explore more opinions
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
