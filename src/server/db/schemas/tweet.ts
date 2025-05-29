import { type USER_TYPE } from "@/types/constants";
import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  numeric,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./base";
import { profiles } from "./profile";
import { projects } from "./signal";

export const tweetUsers = pgTable(
  "tweet_users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    dateUpdated: timestamp("date_updated", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    screenName: varchar("screen_name", { length: 255 }),
    joinDate: timestamp("join_date", { withTimezone: true }),
    followersCount: integer("followers_count").default(0),
    followingCount: integer("following_count").default(0),
    tweetCount: integer("tweet_count").default(0),
    listedCount: integer("listed_count").default(0),
    avatar: text("avatar"),
    name: varchar("name", { length: 255 }),
    restId: varchar("rest_id", { length: 255 }).unique(),
    userType: varchar("user_type", { length: 255 }).$type<USER_TYPE>(),
    subscribeCount: integer("subscribe_count").default(0),
    banner: text("banner"),
    description: text("description"),
    latestFollowing: text("latest_following"),
    pinnedTweetIdsStr: json("pinned_tweet_ids_str"),
    // 信号分析相关
    highestBells: uuid("highest_bells").references((): any => tweetInfo.id),
    compositeScore: numeric("composite_score", {
      precision: 10,
      scale: 2,
    }).default(sql`'0'`),
    signalSuccessRate: real("signal_success_rate"),
    highestScore: real("highest_score").default(sql`'0'`),
    signalCount: integer("signal_count").default(0),
  },
  (table) => [
    index("screen_name_idx").on(table.screenName),
    index("user_type_idx").on(table.userType),
    index("rest_id_idx").on(table.restId),
  ],
).enableRLS();

export const tweetInfo = pgTable(
  "tweet_info",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    tweetId: varchar("tweet_id", { length: 255 }).unique(),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    tweetCreatedAt: timestamp("tweet_created_at", { withTimezone: true }),
    tweetUserId: uuid("tweet_user_id").references((): any => tweetUsers.id),
    content: text("content"),
    lang: varchar("lang", { length: 255 }),
    dealStatus: boolean("deal_status").default(false),
    contentSummary: text("content_summary"),
    tweetUrl: varchar("tweet_url", { length: 255 }),
    imagesUrls: json("images_urls").default([]),
    videoUrls: json("video_urls").default([]),
    replyTweetId: uuid("reply_tweet_id").references((): any => tweetInfo.id),
    retweetTweetId: uuid("retweet_tweet_id").references(
      (): any => tweetInfo.id,
    ),
    quotedTweet: uuid("quoted_tweet").references((): any => tweetInfo.id),
    likes: integer("likes").default(0),
    retweets: integer("retweets").default(0),
    bookmarks: integer("bookmarks").default(0),
    quotes: integer("quotes").default(0),
    replies: integer("replies").default(0),
    // 信号分析相关
    projectId: uuid("project_id").references((): any => projects.id),
    shilling: boolean("shilling").default(false),
    sentiment: varchar("sentiment", { length: 255 }),
    symbols: json("symbols").default([]),
    contractAddress: json("contract_address").default([]),

    signalTime: timestamp("signal_time", { withTimezone: true }),
    signalPrice: numeric("signal_price", { precision: 24, scale: 12 }).default(
      sql`'0'`,
    ),
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
    // 添加7天数据
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
    // 添加30天数据
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
    isAccurate: boolean("is_accurate").default(false),
    accuracy_rate: numeric("accuracy_rate", { precision: 5, scale: 2 }),
    priceSource: varchar("price_source", { length: 255 }),
  },
  (table) => [
    index("tweet_id_idx").on(table.tweetId),
    index("tweet_info_project_id_idx").on(table.projectId),
    index("tweet_info_tweet_user_id_idx").on(table.tweetUserId),
    index("tweet_info_reply_tweet_id_idx").on(table.replyTweetId),
    index("tweet_info_retweet_tweet_id_idx").on(table.retweetTweetId),
    index("quoted_tweet_idx").on(table.quotedTweet),
    index("project_and_signal_time_idx").on(table.projectId, table.signalTime),
  ],
).enableRLS();

export const watchlist = pgTable(
  "watchlist",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    profilesId: uuid("profiles_id")
      .references(() => profiles.id)
      .notNull(),
    tweetUser: uuid("tweet_user")
      .references(() => tweetUsers.id)
      .notNull(),
    notifyOnNewTweet: boolean("notify_on_new_tweet").default(false),
    notifyOnNewFollowing: boolean("notify_on_new_following").default(false),
    dateCreated: timestamp("date_created", { withTimezone: true }).defaultNow(),
    dateUpdated: timestamp("date_updated", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("uniq_profile_tweet").on(table.profilesId, table.tweetUser),
  ],
).enableRLS();

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  profile: one(profiles, {
    fields: [watchlist.profilesId],
    references: [profiles.id],
  }),
  tweetUser: one(tweetUsers, {
    fields: [watchlist.tweetUser],
    references: [tweetUsers.id],
  }),
}));

export const tweetInfoRelations = relations(tweetInfo, ({ one, many }) => ({
  project: one(projects, {
    fields: [tweetInfo.projectId],
    references: [projects.id],
  }),
  quotedTweet: one(tweetInfo, {
    fields: [tweetInfo.quotedTweet],
    references: [tweetInfo.id],
    relationName: "tweetInfo_quotedTweet_tweetInfo_id",
  }),
  quotedByTweets: many(tweetInfo, {
    relationName: "tweetInfo_quotedTweet_tweetInfo_id",
  }),
  replyTweet: one(tweetInfo, {
    fields: [tweetInfo.replyTweetId],
    references: [tweetInfo.id],
    relationName: "tweetInfo_replyTweetId_tweetInfo_id",
  }),
  repliedByTweets: many(tweetInfo, {
    relationName: "tweetInfo_replyTweetId_tweetInfo_id",
  }),
  retweetTweet: one(tweetInfo, {
    fields: [tweetInfo.retweetTweetId],
    references: [tweetInfo.id],
    relationName: "tweetInfo_retweetTweetId_tweetInfo_id",
  }),
  retweetedByTweets: many(tweetInfo, {
    relationName: "tweetInfo_retweetTweetId_tweetInfo_id",
  }),
  tweetUser: one(tweetUsers, {
    fields: [tweetInfo.tweetUserId],
    references: [tweetUsers.id],
  }),
}));

export const tweetUsersRelations = relations(tweetUsers, ({ many }) => ({
  tweetInfos: many(tweetInfo),
}));

export type TweetInfo = InferSelectModel<typeof tweetInfo>;
export type Watchlist = InferSelectModel<typeof watchlist>;
export type TweetUsers = InferSelectModel<typeof tweetUsers>;
