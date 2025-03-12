CREATE TABLE "site_contract_address" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"address" varchar(255),
	"platform" varchar(255),
	"platform_coin" varchar(255),
	"project" uuid,
	"source" varchar(255) DEFAULT 'DEX'
);
--> statement-breakpoint
ALTER TABLE "site_contract_address" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_project_urls" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date_created" timestamp with time zone DEFAULT now(),
	"projects" uuid,
	"name" varchar(255),
	"url" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "site_project_urls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date_created" timestamp with time zone DEFAULT now(),
	"name" varchar(255),
	"description" text,
	"symbol" varchar(255),
	"logo" text,
	"date_added" timestamp with time zone,
	"third_id" varchar(255),
	"flag" varchar(255),
	"price_source" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "site_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_signals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"status" varchar(255) DEFAULT 'draft' NOT NULL,
	"date_created" timestamp (6) with time zone DEFAULT now(),
	"content" text,
	"notify_content" text,
	"ai_result" text,
	"sentiment" varchar(255),
	"signal_time" timestamp (6) with time zone,
	"signal_price" numeric(24, 12),
	"projects" uuid,
	"signals_tag" uuid,
	"media_urls" json,
	"provider" uuid
);
--> statement-breakpoint
ALTER TABLE "site_signals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_signals_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date_updated" timestamp(6) with time zone,
	"name" varchar(255),
	"code" varchar(255),
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_signals_tag" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_tweet_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tweet_id" varchar(255),
	"date_created" timestamp with time zone DEFAULT now(),
	"tweet_user" uuid,
	"content" text,
	"is_deal" boolean DEFAULT false,
	"tweet_url" varchar(255),
	"images_urls" json DEFAULT '[]'::json,
	"video_urls" json DEFAULT '[]'::json,
	"reply_tweet_id" uuid,
	"retweet_tweet_id" uuid,
	"quoted_tweet" uuid,
	"likes" integer DEFAULT 0,
	"retweets" integer DEFAULT 0,
	"bookmarks" integer DEFAULT 0,
	"quotes" integer DEFAULT 0,
	"replies" integer DEFAULT 0,
	"projects_id" uuid,
	"status" varchar(255) DEFAULT 'draft',
	"sentiment" varchar(255),
	"signal_time" timestamp with time zone,
	"high_rate_24h" numeric(10, 2) DEFAULT '0',
	"low_rate_24h" numeric(10, 2) DEFAULT '0',
	"high_price_24h" numeric(24, 12),
	"low_price_24h" numeric(24, 12),
	"low_price_time_24h" timestamp with time zone,
	"high_price_time_24h" timestamp with time zone,
	"high_rate_7d" numeric(10, 2) DEFAULT '0',
	"low_rate_7d" numeric(10, 2) DEFAULT '0',
	"high_price_7d" numeric(24, 12),
	"low_price_7d" numeric(24, 12),
	"low_price_time_7d" timestamp with time zone,
	"high_price_time_7d" timestamp with time zone,
	"high_rate_30d" numeric(10, 2) DEFAULT '0',
	"low_rate_30d" numeric(10, 2) DEFAULT '0',
	"high_price_30d" numeric(24, 12),
	"low_price_30d" numeric(24, 12),
	"low_price_time_30d" timestamp with time zone,
	"high_price_time_30d" timestamp with time zone,
	CONSTRAINT "site_tweet_info_tweet_id_unique" UNIQUE("tweet_id")
);
--> statement-breakpoint
ALTER TABLE "site_tweet_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_tweet_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_created" uuid,
	"date_created" timestamp with time zone DEFAULT now(),
	"user_updated" uuid,
	"date_updated" timestamp with time zone DEFAULT now(),
	"screen_name" varchar(255),
	"join_date" timestamp with time zone,
	"followers_count" integer DEFAULT 0,
	"following_count" integer DEFAULT 0,
	"tweet_count" integer DEFAULT 0,
	"listed_count" integer DEFAULT 0,
	"avatar" text,
	"name" varchar(255),
	"rest_id" varchar(255),
	"flag" varchar(255),
	"subscribe_count" integer DEFAULT 0,
	"highest_score" real DEFAULT '0',
	"signal_count" integer DEFAULT 0,
	"highest_bells" uuid,
	"composite_score" numeric(10, 2) DEFAULT '0',
	"signal_success_rate" real,
	"banner" text,
	"description" text,
	"latest_following" text,
	"pinned_tweet_ids_str" json,
	CONSTRAINT "site_tweet_users_screen_name_unique" UNIQUE("screen_name")
);
--> statement-breakpoint
ALTER TABLE "site_tweet_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_x_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"lowercase_username" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(256),
	"profile_picture" varchar(256),
	"description" text,
	"location" text,
	"full_profile" jsonb,
	"tweets" jsonb,
	"analysis" jsonb,
	"followers" integer DEFAULT 0,
	"profile_scraped_at" timestamp with time zone,
	"tweet_scrape_started" boolean DEFAULT false,
	"tweet_scrape_completed" boolean DEFAULT false,
	"tweet_scrape_started_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "site_x_users_username_unique" UNIQUE("username"),
	CONSTRAINT "site_x_users_lowercase_username_unique" UNIQUE("lowercase_username")
);
--> statement-breakpoint
ALTER TABLE "site_x_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_contract_address" ADD CONSTRAINT "site_contract_address_project_site_projects_id_fk" FOREIGN KEY ("project") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_contract_address" ADD CONSTRAINT "contract_address_project_foreign55" FOREIGN KEY ("project") REFERENCES "public"."site_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_project_urls" ADD CONSTRAINT "site_project_urls_projects_site_projects_id_fk" FOREIGN KEY ("projects") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_signals_tag_site_signals_tag_id_fk" FOREIGN KEY ("signals_tag") REFERENCES "public"."site_signals_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_tweet_user_site_tweet_users_id_fk" FOREIGN KEY ("tweet_user") REFERENCES "public"."site_tweet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_reply_tweet_id_site_tweet_info_id_fk" FOREIGN KEY ("reply_tweet_id") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_retweet_tweet_id_site_tweet_info_id_fk" FOREIGN KEY ("retweet_tweet_id") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_quoted_tweet_site_tweet_info_id_fk" FOREIGN KEY ("quoted_tweet") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD CONSTRAINT "site_tweet_users_user_created_users_id_fk" FOREIGN KEY ("user_created") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD CONSTRAINT "site_tweet_users_user_updated_users_id_fk" FOREIGN KEY ("user_updated") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD CONSTRAINT "site_tweet_users_highest_bells_site_tweet_info_id_fk" FOREIGN KEY ("highest_bells") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "address_idx" ON "site_contract_address" USING btree ("address");--> statement-breakpoint
CREATE INDEX "project_idx" ON "site_contract_address" USING btree ("project");--> statement-breakpoint
CREATE INDEX "symbol_idx" ON "site_projects" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "provider_idx" ON "site_signals" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "code_idx" ON "site_signals_tag" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tweet_id_idx" ON "site_tweet_info" USING btree ("tweet_id");--> statement-breakpoint
CREATE INDEX "screen_name_idx" ON "site_tweet_users" USING btree ("screen_name");--> statement-breakpoint
CREATE INDEX "rest_id_idx" ON "site_tweet_users" USING btree ("rest_id");--> statement-breakpoint
CREATE INDEX "username_idx" ON "site_x_users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "lowercase_username_idx" ON "site_x_users" USING btree ("lowercase_username");