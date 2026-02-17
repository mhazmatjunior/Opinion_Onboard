import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { AdapterAccount } from "next-auth/adapters";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const voteTypeEnum = pgEnum("vote_type", ["up", "down"]);
export const reportStatusEnum = pgEnum("report_status", ["pending", "reviewed", "dismissed"]);

// Tables
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    role: roleEnum("role").default("user").notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
    "accounts",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verification_tokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const opinions = pgTable("opinions", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
    isAnonymous: boolean("is_anonymous").default(false).notNull(),
    isModerated: boolean("is_moderated").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    opinionId: uuid("opinion_id").references(() => opinions.id, { onDelete: "cascade" }).notNull(),
    type: voteTypeEnum("type").notNull(),
});

export const reports = pgTable("reports", {
    id: uuid("id").defaultRandom().primaryKey(),
    opinionId: uuid("opinion_id").references(() => opinions.id, { onDelete: "cascade" }).notNull(),
    commentId: uuid("comment_id").references(() => comments.id, { onDelete: "cascade" }), // Added for comment reports
    reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    reason: text("reason").notNull(),
    details: text("details"),
    status: reportStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    opinionId: uuid("opinion_id").references(() => opinions.id, { onDelete: "cascade" }).notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    isAnonymous: boolean("is_anonymous").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    opinions: many(opinions),
    votes: many(votes),
    reports: many(reports),
    comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    opinions: many(opinions),
}));

export const opinionsRelations = relations(opinions, ({ one, many }) => ({
    author: one(users, {
        fields: [opinions.authorId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [opinions.categoryId],
        references: [categories.id],
    }),
    votes: many(votes),
    reports: many(reports),
    comments: many(comments),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    user: one(users, {
        fields: [votes.userId],
        references: [users.id],
    }),
    opinion: one(opinions, {
        fields: [votes.opinionId],
        references: [opinions.id],
    }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
    opinion: one(opinions, {
        fields: [reports.opinionId],
        references: [opinions.id],
    }),
    comment: one(comments, {
        fields: [reports.commentId],
        references: [comments.id],
    }),
    reporter: one(users, {
        fields: [reports.reporterId],
        references: [users.id],
    }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    opinion: one(opinions, {
        fields: [comments.opinionId],
        references: [opinions.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));
