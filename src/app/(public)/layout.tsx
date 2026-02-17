import { Navigation } from "@/components/ui/Navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
            <footer className="bg-background border-t border-border py-8 mt-12">
                <div className="container-custom text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Opinion Onboard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
