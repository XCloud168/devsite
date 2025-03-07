import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgRole,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `site_${name}`);

export const authenticated = pgRole("authenticated").existing();

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => users.id),
    username: varchar("username", { length: 256 }).notNull(),
    inviteCode: varchar("invite_code", { length: 10 })
      .unique()
      .$defaultFn(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }),
    inviterId: uuid("inviter_id").references((): any => profiles.id),
    inviterSkipped: boolean("inviter_skipped").default(false),
    avatarUrl: varchar("avatar_url", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("invite_code_idx").on(table.inviteCode),
    index("inviter_id_idx").on(table.inviterId),
  ],
).enableRLS();

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export const blogs = pgTable(
  "blogs",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: varchar("title", { length: 256 }),
    content: text("content"),
    authorId: uuid("author_id").references((): any => profiles.id),
    status: varchar("status", { length: 256 })
      .default("draft")
      .$type<"draft" | "published">(), // 'draft' 草稿，'published' 发布
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (blog) => [index("title_idx").on(blog.title)],
).enableRLS();

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export const xUsers = pgTable(
  "x_users",
  {
    id: uuid("id").primaryKey(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    lowercaseUsername: text("lowercase_username").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    name: varchar("name", { length: 256 }),
    profilePicture: varchar("profile_picture", { length: 256 }),
    description: text("description"),
    location: text("location"),
    fullProfile: jsonb("full_profile"),
    tweets: jsonb("tweets"),
    analysis: jsonb("analysis"),
    followers: integer("followers").default(0),

    // status
    profileScrapedAt: timestamp("profile_scraped_at", { withTimezone: true }),
    tweetScrapeStarted: boolean("tweet_scrape_started").default(false),
    tweetScrapeCompleted: boolean("tweet_scrape_completed").default(false),
    tweetScrapeStartedAt: timestamp("tweet_scrape_started_at", {
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => [
    index("username_idx").on(table.username),
    index("lowercase_username_idx").on(table.lowercaseUsername),
    index("created_at_idx").on(table.createdAt),
    index("created_at_date_hour_idx").on(
      sql`date_trunc('hour', ${table.createdAt})`,
    ),
  ],
);

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(profiles, {
    fields: [blogs.authorId],
    references: [profiles.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  inviter: one(profiles, {
    fields: [profiles.inviterId],
    references: [profiles.id],
  }),
}));
