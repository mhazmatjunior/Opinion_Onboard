"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    opinionCount: number;
}

interface AdminCategoriesClientProps {
    categories: Category[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: ""
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setFieldErrors({});
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = "Failed to create category";

                try {
                    const data = JSON.parse(text);
                    errorMessage = data.error || errorMessage;

                    if (data.fieldErrors) {
                        setFieldErrors(data.fieldErrors);
                        // Don't set main error if we have field specific ones, unless it's a general fail
                        if (data.error === "Validation failed") {
                            errorMessage = "";
                        }
                    }
                } catch {
                    errorMessage = `Failed to create category: ${res.status} ${res.statusText}`;
                }

                if (errorMessage) setError(errorMessage);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                setFormData({ name: "", slug: "", description: "" });
                setIsCreateModalOpen(false);
                setSuccess(false);
                router.refresh();
            }, 1000);
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        setLoading(true); // Reuse loading state or add specific one if needed
        try {
            const res = await fetch(`/api/admin/categories?id=${deleteId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    alert(data.error || "Failed to delete category");
                } catch {
                    alert(`Failed to delete category: ${res.status} ${res.statusText}`);
                }
                return;
            }

            router.refresh();
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Category
                </button>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left min-w-[600px] md:min-w-0">
                    <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4 hidden md:table-cell">Description</th>
                            <th className="px-6 py-4">Opinions</th>
                            <th className="px-6 py-4 hidden lg:table-cell">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{category.name}</td>
                                <td className="px-6 py-4 text-muted-foreground truncate max-w-xs hidden md:table-cell">{category.description}</td>
                                <td className="px-6 py-4">{category.opinionCount}</td>
                                <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">{category.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category.id)}
                                            className="p-2 hover:bg-danger/10 rounded-md text-muted-foreground hover:text-danger transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={() => !loading && setIsCreateModalOpen(false)}
                    />
                    <div className="relative bg-card w-full max-w-md rounded-lg border border-border shadow-lg flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold">Create New Category</h2>
                            <button
                                onClick={() => !loading && setIsCreateModalOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                disabled={loading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate}>
                            <div className="p-6 space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-200">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 bg-green-100 border border-green-200 text-green-700 text-sm rounded-md flex items-center gap-2 dark:bg-green-900/30 dark:border-green-900/50 dark:text-green-200">
                                        <CheckCircle className="w-4 h-4 shrink-0" />
                                        <span>Category created successfully!</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(
                                            "w-full p-2.5 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50",
                                            fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-border"
                                        )}
                                        placeholder="e.g. Technology"
                                        disabled={loading}
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-xs text-red-500 font-medium">{fieldErrors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className={cn(
                                            "w-full p-2.5 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50",
                                            fieldErrors.slug ? "border-red-500 focus:ring-red-500" : "border-border"
                                        )}
                                        placeholder="e.g. technology"
                                        disabled={loading}
                                    />
                                    {fieldErrors.slug && (
                                        <p className="text-xs text-red-500 font-medium">{fieldErrors.slug}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={cn(
                                            "w-full min-h-[100px] p-3 rounded-md border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/50",
                                            fieldErrors.description ? "border-red-500 focus:ring-red-500" : "border-border"
                                        )}
                                        placeholder="Category description..."
                                        disabled={loading}
                                    />
                                    {fieldErrors.description && (
                                        <p className="text-xs text-red-500 font-medium">{fieldErrors.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || success}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>Creating...</>
                                    ) : success ? (
                                        <>Created <CheckCircle className="w-3 h-3" /></>
                                    ) : (
                                        "Create Category"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone and will permanently delete all opinions, comments, and reports associated with it."
                confirmText="Delete Category"
                loading={loading}
                variant="danger"
            />
        </div>
    );
}
