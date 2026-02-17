import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user || user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
