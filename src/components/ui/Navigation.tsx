"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NotificationCenter } from "./NotificationCenter";

export function Navigation() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { href: "/categories", label: "Categories" },
        { href: "/about", label: "About" },
    ];

    const isActive = (path: string) => pathname === path;

    const getLoginLink = () => {
        if (pathname.startsWith("/login")) {
            return "/login";
        }
        return `/login?redirect=${encodeURIComponent(pathname)}`;
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container-custom h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">O</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden sm:block">Opinion Onboard</span>
                </Link>

                {/* Desktop & Mobile Nav - Centered */}
                <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8 mx-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                                isActive(link.href) ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            href="/admin/dashboard"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap hidden sm:block",
                                isActive("/admin/dashboard") ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Right Section: Mobile Icon Menu vs Desktop Buttons */}
                <div className="relative flex items-center gap-4" ref={menuRef}>
                    {!loading && (
                        <>
                            {/* Mobile User Menu Icon (Visible only on small screens) */}
                            <div className="sm:hidden">
                                {user ? (
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                                            "bg-primary text-primary-foreground border-primary shadow-md"
                                        )}
                                        aria-label="User menu"
                                    >
                                        <User className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <Link
                                        href={getLoginLink()}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                                            "bg-white text-muted-foreground border-border hover:border-primary shadow-sm"
                                        )}
                                        aria-label="Login"
                                    >
                                    </Link>
                                )}
                            </div>

                            {/* Notifications (Visible for all logged in users) */}
                            {user && (
                                <div className="flex items-center">
                                    <NotificationCenter />
                                </div>
                            )}

                            {/* Desktop Buttons (Visible only on sm and up) */}
                            <div className="hidden sm:flex items-center gap-4">
                                {user ? (
                                    <>
                                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">Hi, {user.name}</span>
                                        <button
                                            onClick={() => logout()}
                                            className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href={getLoginLink()}
                                        className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile Only Dropdown */}
                    {isUserMenuOpen && user && (
                        <div className="sm:hidden absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-border mb-1">
                                <p className="text-xs text-muted-foreground">Signed in as</p>
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                            </div>

                            {user.role === 'admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-primary" />
                                    Admin Dashboard
                                </Link>
                            )}

                            <button
                                onClick={() => {
                                    logout();
                                    setIsUserMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}


