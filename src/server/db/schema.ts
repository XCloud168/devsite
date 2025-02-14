import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgPolicy,
  pgRole,
  pgTableCreator,
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
    inviterId: uuid("inviter_id").references((): any => users.id),
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

export const posts = pgTable(
  "posts",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (example) => [index("name_idx").on(example.name)],
).enableRLS();
