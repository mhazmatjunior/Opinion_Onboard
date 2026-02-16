"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Flag, ShieldAlert, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/categories", label: "Categories", icon: List },
        { href: "/admin/reports", label: "Reports", icon: Flag },
        { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-64 bg-background border-r border-border h-screen flex flex-col sticky top-0 hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">O</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin</span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive(link.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
