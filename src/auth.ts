
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { accounts, sessions, users, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    trustHost: true,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            const dbUser = await db.query.users.findFirst({
                where: eq(users.email, user.email)
            });

            if (dbUser?.isBanned) {
                return false; // Reject sign in for banned users
            }
            return true;
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;

                // Fetch latest data from DB to ensure session has role and ban status
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.id, user.id)
                });

                if (dbUser) {
                    (session.user as any).role = dbUser.role;
                    (session.user as any).isBanned = dbUser.isBanned;
                }
            }
            return session;
        },
    },
})
