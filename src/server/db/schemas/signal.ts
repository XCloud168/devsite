import {
  type PUBLISH_STATUS,
  type SIGNAL_PROVIDER_TYPE,
} from "@/types/constants";
import { InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  integer,
  json,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { announcement } from "./exchange";
import { tweetInfo } from "./tweet";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    symbol: varchar("symbol", { length: 255 }),
    logo: text("logo"),
    dateAdded: timestamp("date_added", { withTimezone: true }),
    solContract: varchar("sol_contract", { length: 255 }),
    ethContract: varchar("eth_contract", { length: 255 }),
    bscContract: varchar("bsc_contract", { length: 255 }),
    tronContract: varchar("tron_contract", { length: 255 }),
    baseContract: varchar("base_contract", { length: 255 }),
    blastContract: varchar("blast_contract", { length: 255 }),
    otherContract: varchar("other_contract", { length: 255 }),
    urls: json("urls"), // website, telegram, twitter, discord, medium, blog, github, youtube, instagram, tiktok, twitch, pinterest, linkedin, reddit, telegram, telegram_channel, telegram_group, telegram_channel_id, telegram_group_id
    priceSource: varchar("price_source", { length: 255 }),
  },
  (table) => [
    index("symbol_idx").on(table.symbol),
    index("sol_contract_idx").on(table.solContract),
    index("eth_contract_idx").on(table.ethContract),
    index("bsc_contract_idx").on(table.bscContract),
    index("tron_contract_idx").on(table.tronContract),
    index("base_contract_idx").on(table.baseContract),
    index("blast_contract_idx").on(table.blastContract),
  ],
).enableRLS();

export const signals = pgTable(
  "signals",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    status: varchar("status", { length: 255 })
      .default("draft")
      .notNull()
      .$type<PUBLISH_STATUS>(),
    dateCreated: timestamp("date_created", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    notifyContent: text("notify_content"),
    aiSummary: text("ai_summary"),
    signalTime: timestamp("signal_time", { withTimezone: true }).notNull(),
    projectId: uuid("project_id").references((): any => projects.id),
    categoryId: uuid("category_id")
      .references((): any => signalsCategory.id)
      .notNull(),
    mediaUrls: json("media_urls"),
    tags: json("tags"), // "exchange_name": "Binance", "category": "spot/futures/Alpha/pre-market", "first_listing": True/False
    providerId: uuid("provider_id").notNull(), // tweet_info.id announcement.id
    entityId: uuid("entity_id").notNull(), // 实体id 如twitter用户id exchange id
    isAccurate: boolean("is_accurate"),
    accuracyRate: numeric("accuracy_rate", { precision: 5, scale: 2 }),
    providerType: varchar("provider_type", { length: 255 })
      .default("twitter")
      .$type<SIGNAL_PROVIDER_TYPE>(),
  },
  (table) => [
    index("signals_provider_id_idx").on(table.providerId),
    index("signals_project_id_idx").on(table.projectId),
    index("signals_category_id_idx").on(table.categoryId),
    index("signals_entity_id_idx").on(table.entityId),
    index("signals_provider_type_idx").on(table.providerType),
    index("category_and_provider_type_and_entity_id_idx").on(
      table.categoryId,
      table.providerType,
      table.entityId,
    ),
    index("category_and_provider_type_idx").on(
      table.categoryId,
      table.providerType,
    ),
    index("category_and_signal_time_idx").on(
      table.categoryId,
      table.signalTime,
    ),
    index("project_and_entity_and_signal_time_idx").on(
      table.projectId,
      table.entityId,
      table.signalTime,
    ),
  ],
).enableRLS();

export const signalsCategory = pgTable(
  "signals_category",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    dateCreated: timestamp("date_created", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    dateUpdated: timestamp("date_updated", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 255 }).notNull().unique(),
    sort: integer("sort").default(0).notNull(),
  },
  (table) => [index("code_idx").on(table.code)],
).enableRLS();

export const projectsRelations = relations(projects, ({ many }) => ({
  signals: many(signals),
  tweetInfos: many(tweetInfo),
  announcements: many(announcement),
}));

export const signalsRelations = relations(signals, ({ one }) => ({
  project: one(projects, {
    fields: [signals.projectId],
    references: [projects.id],
  }),
  category: one(signalsCategory, {
    fields: [signals.categoryId],
    references: [signalsCategory.id],
  }),
}));

export type Signals = InferSelectModel<typeof signals>;
export type Projects = InferSelectModel<typeof projects>;
export type SignalsCategory = InferSelectModel<typeof signalsCategory>;
