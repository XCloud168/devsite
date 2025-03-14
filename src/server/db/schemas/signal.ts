import {
  timestamp,
  uuid,
  varchar,
  text,
  json,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { pgTable } from "./base";
import { relations } from "drizzle-orm";
import { tweetInfo } from "./tweet";
import { announcement } from "./exchange";

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
    status: varchar("status", { length: 255 }).default("draft").notNull(),
    dateCreated: timestamp("date_created", {
      precision: 6,
      withTimezone: true,
    }).defaultNow(),
    content: text("content"),
    notifyContent: text("notify_content"),
    aiResult: text("ai_result"),
    signalTime: timestamp("signal_time", { precision: 6, withTimezone: true }),
    projectsId: uuid("projects_id").references((): any => projects.id),
    signalsTag: uuid("signals_tag").references((): any => signalsTag.id),
    mediaUrls: json("media_urls"),
    provider: uuid("provider"),
  },
  (table) => [index("provider_idx").on(table.provider)],
).enableRLS();

export const signalsTag = pgTable(
  "signals_tag",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    dateUpdated: timestamp("date_updated", {
      precision: 6,
      withTimezone: true,
      mode: "string",
    }),
    name: varchar("name", { length: 255 }),
    code: varchar("code", { length: 255 }),
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
    fields: [signals.projectsId],
    references: [projects.id],
  }),
  signalsTag: one(signalsTag, {
    fields: [signals.signalsTag],
    references: [signalsTag.id],
  }),
}));
