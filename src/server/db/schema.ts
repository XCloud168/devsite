import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  jsonb,
  pgRole,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
  real,
  numeric,
  bigint,
  doublePrecision,
  foreignKey,
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
  ],
).enableRLS();

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

export const tweetUsers = pgTable("tweet_users", {
	id: uuid("id").primaryKey().notNull(),
	userCreated: uuid("user_created").references((): any => users.id),
	dateCreated: timestamp("date_created", { withTimezone: true}).defaultNow(),
	userUpdated: uuid("user_updated").references((): any => users.id),
	dateUpdated: timestamp("date_updated", { withTimezone: true}).defaultNow().$onUpdate(() => new Date()),
	screenName: varchar("screen_name", { length: 255 }).unique(),
	joinDate: timestamp("join_date", { withTimezone: true}),
	followersCount: integer("followers_count").default(0),
	followingCount: integer("following_count").default(0),
	tweetCount: integer("tweet_count").default(0),
	listedCount: integer("listed_count").default(0),
	avatar: text("avatar"),
	name: varchar("name", { length: 255 }),
	restId: varchar("rest_id", { length: 255 }),
	flag: varchar("flag", { length: 255 }),
	subscribeCount: integer("subscribe_count").default(0),
	highestScore: real("highest_score").default(sql`'0'`),
	signalCount: integer("signal_count").default(0),
	highestBells: uuid("highest_bells").references((): any => tweetInfo.id),
	compositeScore: numeric("composite_score", { precision: 10, scale:  2 }).default(sql`'0'`),
	signalSuccessRate: real("signal_success_rate"),
	banner: text("banner"),
	description: text("description"),
	latestFollowing: text("latest_following"),
	pinnedTweetIdsStr: json("pinned_tweet_ids_str"),
}, (table) => [
  index("screen_name_idx").on(table.screenName),
  index("rest_id_idx").on(table.restId),
]).enableRLS();

export const contractAddress = pgTable("contract_address", {
	id: uuid("id").primaryKey().notNull(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	address: varchar("address", { length: 255 }),
	platform: varchar("platform", { length: 255 }),
	platformCoin: varchar("platform_coin", { length: 255 }),
	project: uuid("project").references((): any => projects.id),
	source: varchar("source", { length: 255 }).default('DEX'),
}, (table) => [
  index("address_idx").on(table.address),
  index("project_idx").on(table.project),
	foreignKey({
			columns: [table.project],
			foreignColumns: [projects.id],
			name: "contract_address_project_foreign55"
		}).onDelete("set null"),
]).enableRLS();

export const projects = pgTable("projects", {
	id: uuid("id").primaryKey().notNull(),
	dateCreated: timestamp("date_created", { withTimezone: true}).defaultNow(),
	name: varchar("name", { length: 255 }),
	description: text("description"),
	symbol: varchar("symbol", { length: 255 }),
	logo: text("logo"),
	dateAdded: timestamp("date_added", { withTimezone: true}),
	thirdId: varchar("third_id", { length: 255 }),
	flag: varchar("flag", { length: 255 }),
	priceSource: varchar("price_source", { length: 255 }),
}, (table) => [
  index("symbol_idx").on(table.symbol),
]).enableRLS();

export const projectUrls = pgTable("project_urls", {
	id: uuid("id").primaryKey().notNull(),
	dateCreated: timestamp("date_created", { withTimezone: true}).defaultNow(),
	projects: uuid().references((): any => projects.id),
	name: varchar("name", { length: 255 }),
	url: varchar("url", { length: 255 }),
}).enableRLS();

export const signals = pgTable("signals", {
	id: uuid("id").primaryKey().notNull(),
	status: varchar("status", { length: 255 }).default('draft').notNull(),
	dateCreated: timestamp("date_created", { precision: 6, withTimezone: true}).defaultNow(),
	content: text("content"),
  notifyContent: text("notify_content"),
  aiResult: text("ai_result"),
	sentiment: varchar("sentiment", { length: 255 }),
	signalTime: timestamp("signal_time", { precision: 6, withTimezone: true}),
	signalPrice: numeric("signal_price", { precision: 24, scale:  12 }),
	projects: uuid("projects"),
	signalsTag: uuid("signals_tag").references((): any => signalsTag.id),
	mediaUrls: json("media_urls"),
	provider: uuid("provider"),
}, (table) => [
  index("provider_idx").on(table.provider),
]).enableRLS();

export const signalsTag = pgTable("signals_tag", {
	id: uuid("id").primaryKey().notNull(),
	dateUpdated: timestamp("date_updated", { precision: 6, withTimezone: true, mode: 'string' }),
	name: varchar("name", { length: 255 }),
	code: varchar("code", { length: 255 }),
	sort: integer("sort").default(0).notNull(),
}, (table) => [
  index("code_idx").on(table.code),
]).enableRLS();

export const tweetInfo = pgTable("tweet_info", {
	id: uuid("id").primaryKey(),
	tweetId: varchar("tweet_id", { length: 255 }).unique(),
	dateCreated: timestamp("date_created", { withTimezone: true}).defaultNow(),
	tweetUser: uuid("tweet_user").references((): any => tweetUsers.id),
	content: text("content"),
	isDeal: boolean("is_deal").default(false),
	tweetUrl: varchar("tweet_url", { length: 255 }),
	imagesUrls: json("images_urls").default([]),
	videoUrls: json("video_urls").default([]),
	replyTweetId: uuid("reply_tweet_id").references((): any => tweetInfo.id),
	retweetTweetId: uuid("retweet_tweet_id").references((): any => tweetInfo.id),
	quotedTweet: uuid("quoted_tweet").references((): any => tweetInfo.id),
	likes: integer("likes").default(0),
	retweets: integer("retweets").default(0),
	bookmarks: integer("bookmarks").default(0),
	quotes: integer("quotes").default(0),
	replies: integer("replies").default(0),
	projectsId: uuid("projects_id").references((): any => projects.id),
	status: varchar("status", { length: 255 }).default('draft'),
	sentiment: varchar("sentiment", { length: 255 }),
	signalTime: timestamp("signal_time", { withTimezone: true}),
	highRate24H: numeric("high_rate_24h", { precision: 10, scale:  2 }).default(sql`'0'`),
	lowRate24H: numeric("low_rate_24h", { precision: 10, scale:  2 }).default(sql`'0'`),
	highPrice24H: numeric("high_price_24h", { precision: 24, scale:  12 }),
	lowPrice24H: numeric("low_price_24h", { precision: 24, scale:  12 }),
	lowPriceTime24H: timestamp("low_price_time_24h", { withTimezone: true}),
	highPriceTime24H: timestamp("high_price_time_24h", { withTimezone: true}),
	// 添加7天数据
	highRate7D: numeric("high_rate_7d", { precision: 10, scale:  2 }).default(sql`'0'`),
	lowRate7D: numeric("low_rate_7d", { precision: 10, scale:  2 }).default(sql`'0'`),
	highPrice7D: numeric("high_price_7d", { precision: 24, scale:  12 }),
	lowPrice7D: numeric("low_price_7d", { precision: 24, scale:  12 }),
	lowPriceTime7D: timestamp("low_price_time_7d", { withTimezone: true}),
	highPriceTime7D: timestamp("high_price_time_7d", { withTimezone: true}),
	// 添加30天数据
	highRate30D: numeric("high_rate_30d", { precision: 10, scale:  2 }).default(sql`'0'`),
	lowRate30D: numeric("low_rate_30d", { precision: 10, scale:  2 }).default(sql`'0'`),
	highPrice30D: numeric("high_price_30d", { precision: 24, scale:  12 }),
	lowPrice30D: numeric("low_price_30d", { precision: 24, scale:  12 }),
	lowPriceTime30D: timestamp("low_price_time_30d", { withTimezone: true}),
	highPriceTime30D: timestamp("high_price_time_30d", { withTimezone: true}),
}, (table) => [
  index("tweet_id_idx").on(table.tweetId),
]).enableRLS();

export const contractAddressRelations = relations(contractAddress, ({one}) => ({
	project: one(projects, {
		fields: [contractAddress.project],
		references: [projects.id]
	}),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	contractAddresses: many(contractAddress),
	projectUrls: many(projectUrls),
	signals: many(signals),
	tweetInfos: many(tweetInfo),
}));

export const projectUrlsRelations = relations(projectUrls, ({one}) => ({
	project: one(projects, {
		fields: [projectUrls.projects],
		references: [projects.id]
	}),
}));

export const signalsRelations = relations(signals, ({one}) => ({
	project: one(projects, {
		fields: [signals.projects],
		references: [projects.id]
	}),
	signalsTag: one(signalsTag, {
		fields: [signals.signalsTag],
		references: [signalsTag.id]
	}),
}));

export const tweetInfoRelations = relations(tweetInfo, ({one, many}) => ({
	project: one(projects, {
		fields: [tweetInfo.projectsId],
		references: [projects.id]
	}),
	tweetInfo_quotedTweet: one(tweetInfo, {
		fields: [tweetInfo.quotedTweet],
		references: [tweetInfo.id],
		relationName: "tweetInfo_quotedTweet_tweetInfo_id"
	}),
	tweetInfos_quotedTweet: many(tweetInfo, {
		relationName: "tweetInfo_quotedTweet_tweetInfo_id"
	}),
	tweetInfo_replyTweetId: one(tweetInfo, {
		fields: [tweetInfo.replyTweetId],
		references: [tweetInfo.id],
		relationName: "tweetInfo_replyTweetId_tweetInfo_id"
	}),
	tweetInfos_replyTweetId: many(tweetInfo, {
		relationName: "tweetInfo_replyTweetId_tweetInfo_id"
	}),
	tweetInfo_retweetTweetId: one(tweetInfo, {
		fields: [tweetInfo.retweetTweetId],
		references: [tweetInfo.id],
		relationName: "tweetInfo_retweetTweetId_tweetInfo_id"
	}),
	tweetInfos_retweetTweetId: many(tweetInfo, {
		relationName: "tweetInfo_retweetTweetId_tweetInfo_id"
	}),
	tweetUser: one(tweetUsers, {
		fields: [tweetInfo.tweetUser],
		references: [tweetUsers.id]
	}),
}));

export const tweetUsersRelations = relations(tweetUsers, ({many}) => ({
	tweetInfos: many(tweetInfo),
}));