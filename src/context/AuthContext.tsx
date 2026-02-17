"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

type User = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "admin" | "user"; // We might need to extend session for this
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    loading: boolean;
    login: (provider: string, callbackUrl?: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

function AuthContextWrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            // Mapping session user to context user
            // Note: Standard NextAuth session user might not have 'role' unless customized
            // For now, we default to 'user' or try to read it if we added it to the session callback
            setUser({
                id: session.user.id || "",
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
                role: (session.user as any).role || "user",
            });
        } else {
            setUser(null);
        }
    }, [session]);

    const login = async (provider: string, callbackUrl?: string) => {
        console.log("AuthContext: signIn called for", provider, "callbackUrl:", callbackUrl);
        try {
            await signIn(provider, { callbackUrl: callbackUrl || "/" });
        } catch (error) {
            console.error("AuthContext: signIn error", error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <AuthContext.Provider value={{ user, loading: status === "loading", login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthContextWrapper>{children}</AuthContextWrapper>
        </SessionProvider>
    );
}

export const useAuth = () => useContext(AuthContext);
