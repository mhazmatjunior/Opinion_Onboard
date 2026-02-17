import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Protect Admin Routes
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        // Optional: Check for admin role
        // if (req.auth.user.role !== "admin") { ... }
    }

    // Protect API Admin Routes
    if (pathname.startsWith("/api/admin")) {
        if (!isLoggedIn) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
