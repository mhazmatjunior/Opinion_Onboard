import { db } from "@/db";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    const categoriesData = await db.query.categories.findMany({
        with: {
            opinions: true
        }
    });

    const formattedCategories = categoriesData.map((c: typeof categoriesData[number]) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        opinionCount: c.opinions.length
    }));

    return <AdminCategoriesClient categories={formattedCategories} />;
}
