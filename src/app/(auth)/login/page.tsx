"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const { login } = useAuth(); // Now refers to signIn('provider')
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const handleGoogleLogin = async () => {
        console.log("Google Login Clicked");
        setLoading(true);
        try {
            console.log("Calling login('google') with redirect:", redirectUrl);
            await login("google", redirectUrl);
        } catch (err) {
            console.error("Login failed", err);
            alert(`Login failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            console.log("Login call finished (or redirected).");
            // If redirect happens, we might not see this.
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm p-8 max-w-md w-full mx-auto mt-10">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight mb-2">Get Started</h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to join the conversation.
                </p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-medium py-2.5 px-4 rounded-md transition-all shadow-sm disabled:opacity-50"
                >
                    {loading ? (
                        "Connecting..."
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Secure Login</span>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}
