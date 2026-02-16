import Link from "next/link";
import { Category } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    category: Category;
    className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className={cn(
                "group block bg-card border border-border rounded-lg p-6",
                "hover:border-primary/50 hover:shadow-md transition-all duration-200",
                className
            )}
        >
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {category.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                {category.description}
            </p>
            <div className="flex items-center text-xs text-muted-foreground font-medium">
                <span className="bg-muted px-2 py-1 rounded-full">
                    {category.opinionCount} opinions
                </span>
            </div>
        </Link>
    );
}
