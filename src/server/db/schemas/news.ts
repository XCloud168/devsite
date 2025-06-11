import {
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  boolean,
  json,
  index,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { projects } from "./signal";
import { relations, sql } from "drizzle-orm";

// 新闻提供者表
export const newsEntity = pgTable(
  "news_entity",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    logo: text("logo"),
    description: text("description"),
    website: varchar("website", { length: 255 }),
    apiEndpoint: varchar("api_endpoint", { length: 255 }),
    isActive: boolean("is_active").default(true),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("news_entity_name_idx").on(table.name)],
).enableRLS();

// 新闻表
export const news = pgTable(
  "news",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    title: text("title").notNull(),
    content: text("content"),
    contentSummary: text("content_summary"),
    source: text("source"),
    dealStatus: boolean("deal_status").default(false),
    sentiment: varchar("sentiment", { length: 255 }),
    projectId: uuid("project_id").references(() => projects.id),
    newsEntityId: uuid("news_entity_id").references(() => newsEntity.id),
    symbols: json("symbols").default([]),
    contractAddress: json("contract_address").default([]),
    mediaUrls: json("media_urls"),
    // 价格相关字段
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
    highPrice24H: numeric("high_price_24h", {
      precision: 24,
      scale: 12,
    }).default(sql`'0'`),
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
    highPrice30D: numeric("high_price_30d", {
      precision: 24,
      scale: 12,
    }).default(sql`'0'`),
    lowPrice30D: numeric("low_price_30d", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
    lowPriceTime30D: timestamp("low_price_time_30d", { withTimezone: true }),
    highPriceTime30D: timestamp("high_price_time_30d", { withTimezone: true }),

    priceSource: varchar("price_source", { length: 255 }),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    dateUpdated: timestamp("date_updated", { withTimezone: true }),
    isAccurate: boolean("is_accurate").default(false),
    accuracyRate: numeric("accuracy_rate", { precision: 5, scale: 2 }),
  },
  (table) => [
    index("news_title_idx").on(table.title),
    index("news_entity_id_idx").on(table.newsEntityId),
    index("news_project_id_idx").on(table.projectId),
  ],
).enableRLS();

// 关系定义
export const newsRelations = relations(news, ({ one }) => ({
  project: one(projects, {
    fields: [news.projectId],
    references: [projects.id],
  }),
  newsEntity: one(newsEntity, {
    fields: [news.newsEntityId],
    references: [newsEntity.id],
  }),
}));

export const newsEntityRelations = relations(newsEntity, ({ many }) => ({
  news: many(news),
}));
