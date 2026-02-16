import { notFound } from "next/navigation";
import { categories, opinions } from "@/lib/mockData";
import { CategoryClientPage } from "@/components/pages/CategoryClientPage";

// In Next.js 15+, params is a Promise.
// But in Next.js 14, params is an object.
// The user specified Next.js 14+.
// However, I installed 'create-next-app@latest', which installed Next.js 15+ (15.1.0 in previous step output?). The package.json showed 16.1.6 (Canary? or weird versioning).
// Actually, `package.json` showed `"next": "16.1.6"`. This is likely Next.js 15.1 or similar, or I should treat params as a Promise to be safe for future.
// Wait, `next` 16? That doesn't exist yet as stable. Probably 15.
// In Next 15, `params` should be awaited.
// I will implement it as async function awaiting params.

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    // Filter opinions for this category
    // In mock data, I have categoryId. I need to map slug -> categoryId or match logic.
    // Mock data categories have IDs 1-8. Slugs are set.
    // Mock data opinions have categoryId.
    // I'll filter by categoryId matching the category.id

    const categoryOpinions = opinions.filter((o) => o.categoryId === category.id);

    return <CategoryClientPage category={category} opinions={categoryOpinions} />;
}
