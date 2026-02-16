import { categories } from "@/lib/mockData";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" />
                    Create Category
                </button>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Opinions</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{category.name}</td>
                                <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{category.description}</td>
                                <td className="px-6 py-4">{category.opinionCount}</td>
                                <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-danger transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
