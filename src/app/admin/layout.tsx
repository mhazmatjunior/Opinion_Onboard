import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Mobile header could go here if needed, but Sidebar handles desktop. 
              Mobile sidebar trigger would need state lift or client component for layout? 
              Ref: Navigation has mobile menu. AdminSidebar is hidden on mobile in current implementation.
              I should probably expose a mobile menu trigger here or in a header.
              For Part 1, I'll stick to a simple structure where content is accessible.
          */}
                <header className="h-16 border-b border-border bg-background md:hidden flex items-center px-4">
                    <span className="font-bold">Admin Panel</span>
                    {/* TODO: Add mobile sidebar toggle */}
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
