import { opinions } from "@/lib/mockData";
import { Search, Trash2, Ban, Eye } from "lucide-react";

export default function AdminModerationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search content or users..."
                        className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {opinions.map((opinion) => (
                    <div key={opinion.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:border-border/80 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">
                                    {opinion.isAnonymous ? (
                                        <span className="flex items-center gap-1.5">
                                            Posted Anonymously
                                            <button className="text-xs text-primary hover:underline flex items-center gap-0.5 bg-primary/5 px-1.5 py-0.5 rounded">
                                                <Eye className="w-3 h-3" /> Reveal
                                            </button>
                                        </span>
                                    ) : (
                                        opinion.authorName
                                    )}
                                </span>
                                <span className="text-muted-foreground">• {opinion.timestamp}</span>
                                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium border border-border">
                                    {opinion.categoryName}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Score: {opinion.voteScore}
                            </div>
                        </div>

                        <p className="text-foreground mb-4">{opinion.content}</p>

                        <div className="flex items-center gap-3 pt-3 border-t border-border">
                            <button className="text-danger hover:bg-danger/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Post
                            </button>
                            <button className="text-muted-foreground hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <Ban className="w-4 h-4" />
                                Ban User
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
