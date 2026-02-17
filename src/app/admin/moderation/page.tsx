import { db } from "@/db";
import { opinions, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ModerationQueueClient } from "@/components/admin/ModerationQueueClient";

export const dynamic = 'force-dynamic';

export default async function AdminModerationPage() {
    // Fetch unmoderated opinions
    const unmoderatedOpinions = await db.query.opinions.findMany({
        where: eq(opinions.isModerated, false),
        orderBy: [desc(opinions.createdAt)],
        limit: 50,
        with: {
            author: true,
            category: true,
            votes: true
        }
    });

    const formattedOpinions = unmoderatedOpinions.map(op => ({
        id: op.id,
        content: op.content,
        authorName: op.author.name || "Unknown",
        authorId: op.author.id,
        isAnonymous: op.isAnonymous,
        categoryName: op.category.name,
        timestamp: new Date(op.createdAt).toLocaleString(),
        voteScore: op.votes.reduce((acc, vote) => acc + (vote.type === "up" ? 1 : -1), 0)
    }));

    return <ModerationQueueClient initialOpinions={formattedOpinions} />;
}
