import {
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  index,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { projects } from "./signal";
import { relations, sql } from "drizzle-orm";

export const exchange = pgTable(
  "exchange",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    logo: text("logo"),
    description: text("description"),
    website: varchar("website", { length: 255 }),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("exchange_name_idx").on(table.name)],
).enableRLS();

export const announcement = pgTable(
  "announcement",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    title: text("title"),
    content: text("content"),
    source: text("source"),
    dealStatus: boolean("deal_status").default(false),
    contentSummary: text("content_summary"),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    projectId: uuid("project_id").references(() => projects.id),
    status: varchar("status", { length: 255 }).default("draft"),
    sentiment: varchar("sentiment", { length: 255 }),
    symbols: json("symbols").default([]),
    contractAddress: json("contract_address").default([]),
    signalTime: timestamp("signal_time", { withTimezone: true }),
    signalPrice: numeric("signal_price", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),

    // 24小时数据
    highRate24H: numeric("high_rate_24h", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    lowRate24H: numeric("low_rate_24h", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    highPrice24H: numeric("high_price_24h", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPrice24H: numeric("low_price_24h", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPriceTime24H: timestamp("low_price_time_24h", { withTimezone: true }),
    highPriceTime24H: timestamp("high_price_time_24h", { withTimezone: true }),

    // 7天数据
    highRate7D: numeric("high_rate_7d", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    lowRate7D: numeric("low_rate_7d", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    highPrice7D: numeric("high_price_7d", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPrice7D: numeric("low_price_7d", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPriceTime7D: timestamp("low_price_time_7d", { withTimezone: true }),
    highPriceTime7D: timestamp("high_price_time_7d", { withTimezone: true }),

    // 30天数据
    highRate30D: numeric("high_rate_30d", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    lowRate30D: numeric("low_rate_30d", { precision: 10, scale: 2 }).default(
      sql`'0'`,
    ),
    highPrice30D: numeric("high_price_30d", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPrice30D: numeric("low_price_30d", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPriceTime30D: timestamp("low_price_time_30d", { withTimezone: true }),
    highPriceTime30D: timestamp("high_price_time_30d", { withTimezone: true }),
    exchangeId: uuid("exchange_id").references(() => exchange.id),
  },
  (table) => [
    index("announcement_title_idx").on(table.title),
    index("exchange_id_idx").on(table.exchangeId),
  ],
).enableRLS();

export const announcementRelations = relations(announcement, ({ one }) => ({
  project: one(projects, {
    fields: [announcement.projectId],
    references: [projects.id],
  }),
  exchange: one(exchange, {
    fields: [announcement.exchangeId],
    references: [exchange.id],
  }),
}));

export const exchangeRelations = relations(exchange, ({ many }) => ({
  announcements: many(announcement),
}));
