import { CategoryCard } from "@/components/ui/CategoryCard";
import { db } from "@/db";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categoriesData = await db.query.categories.findMany({
        with: {
            opinions: true
        }
    });

    const formattedCategories = categoriesData.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        opinionCount: c.opinions.length
    }));

    return (
        <div className="container-custom py-12">
            <div className="max-w-2xl mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-4">All Categories</h1>
                <p className="text-muted-foreground text-lg">
                    Explore diverse topics and join the conversation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}
