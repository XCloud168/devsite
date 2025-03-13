import {
  index,
  integer,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "./profile";
import { pgTable } from "./base";

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

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(profiles, {
    fields: [blogs.authorId],
    references: [profiles.id],
  }),
}));
