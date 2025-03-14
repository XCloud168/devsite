CREATE TABLE "site_announcement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"content" text,
	"source" text,
	"deal_status" boolean DEFAULT false,
	"analysis_result" text,
	"date_created" timestamp with time zone DEFAULT now(),
	"projects_id" uuid,
	"status" varchar(255) DEFAULT 'draft',
	"sentiment" varchar(255),
	"signal_time" timestamp with time zone,
	"signal_price" numeric(24, 12),
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
	"exchange_id" uuid
);
--> statement-breakpoint
ALTER TABLE "site_announcement" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_exchange" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" text,
	"description" text,
	"website" varchar(255),
	"date_created" timestamp with time zone DEFAULT now(),
	CONSTRAINT "site_exchange_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "site_exchange" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_payment_addresses" (
	"address" varchar(255) PRIMARY KEY NOT NULL,
	"chain" varchar(255) DEFAULT 'ETH',
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_payment_addresses_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "site_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"receiver_address" varchar(255),
	"chain" varchar(255) NOT NULL,
	"plan_type" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"tx_hash" varchar(255),
	"status" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date_created" timestamp with time zone DEFAULT now(),
	"name" varchar(255),
	"description" text,
	"symbol" varchar(255),
	"logo" text,
	"date_added" timestamp with time zone,
	"sol_contract" varchar(255),
	"eth_contract" varchar(255),
	"bsc_contract" varchar(255),
	"tron_contract" varchar(255),
	"base_contract" varchar(255),
	"blast_contract" varchar(255),
	"flag" varchar(255),
	"urls" json,
	"price_source" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "site_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" varchar(255) DEFAULT 'draft' NOT NULL,
	"date_created" timestamp (6) with time zone DEFAULT now(),
	"content" text,
	"notify_content" text,
	"ai_result" text,
	"signal_time" timestamp (6) with time zone,
	"projects_id" uuid,
	"signals_tag" uuid,
	"media_urls" json,
	"provider" uuid
);
--> statement-breakpoint
ALTER TABLE "site_signals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_signals_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date_updated" timestamp(6) with time zone,
	"name" varchar(255),
	"code" varchar(255),
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_signals_tag" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_tweet_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tweet_id" varchar(255),
	"date_created" timestamp with time zone DEFAULT now(),
	"tweet_created_at" timestamp with time zone,
	"tweet_user" uuid,
	"content" text,
	"deal_status" boolean DEFAULT false,
	"analysis_result" text,
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
	"sentiment" varchar(255),
	"signal_time" timestamp with time zone,
	"signal_price" numeric(24, 12),
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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date_created" timestamp with time zone DEFAULT now(),
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
CREATE TABLE "site_watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profiles_id" uuid,
	"tweet_user" uuid,
	"notify_on_new_tweet" boolean DEFAULT false,
	"notify_on_new_following" boolean DEFAULT false,
	"date_created" timestamp with time zone DEFAULT now(),
	"date_updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "site_watchlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "membership_expired_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD CONSTRAINT "site_announcement_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD CONSTRAINT "site_announcement_exchange_id_site_exchange_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."site_exchange"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_payments" ADD CONSTRAINT "site_payments_user_id_site_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."site_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_payments" ADD CONSTRAINT "site_payments_receiver_address_site_payment_addresses_address_fk" FOREIGN KEY ("receiver_address") REFERENCES "public"."site_payment_addresses"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_signals_tag_site_signals_tag_id_fk" FOREIGN KEY ("signals_tag") REFERENCES "public"."site_signals_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_tweet_user_site_tweet_users_id_fk" FOREIGN KEY ("tweet_user") REFERENCES "public"."site_tweet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_reply_tweet_id_site_tweet_info_id_fk" FOREIGN KEY ("reply_tweet_id") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_retweet_tweet_id_site_tweet_info_id_fk" FOREIGN KEY ("retweet_tweet_id") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_quoted_tweet_site_tweet_info_id_fk" FOREIGN KEY ("quoted_tweet") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD CONSTRAINT "site_tweet_users_highest_bells_site_tweet_info_id_fk" FOREIGN KEY ("highest_bells") REFERENCES "public"."site_tweet_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_watchlist" ADD CONSTRAINT "site_watchlist_profiles_id_site_profiles_id_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."site_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_watchlist" ADD CONSTRAINT "site_watchlist_tweet_user_site_tweet_users_id_fk" FOREIGN KEY ("tweet_user") REFERENCES "public"."site_tweet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcement_title_idx" ON "site_announcement" USING btree ("title");--> statement-breakpoint
CREATE INDEX "exchange_id_idx" ON "site_announcement" USING btree ("exchange_id");--> statement-breakpoint
CREATE INDEX "exchange_name_idx" ON "site_exchange" USING btree ("name");--> statement-breakpoint
CREATE INDEX "symbol_idx" ON "site_projects" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "sol_contract_idx" ON "site_projects" USING btree ("sol_contract");--> statement-breakpoint
CREATE INDEX "eth_contract_idx" ON "site_projects" USING btree ("eth_contract");--> statement-breakpoint
CREATE INDEX "bsc_contract_idx" ON "site_projects" USING btree ("bsc_contract");--> statement-breakpoint
CREATE INDEX "tron_contract_idx" ON "site_projects" USING btree ("tron_contract");--> statement-breakpoint
CREATE INDEX "base_contract_idx" ON "site_projects" USING btree ("base_contract");--> statement-breakpoint
CREATE INDEX "blast_contract_idx" ON "site_projects" USING btree ("blast_contract");--> statement-breakpoint
CREATE INDEX "provider_idx" ON "site_signals" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "code_idx" ON "site_signals_tag" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tweet_id_idx" ON "site_tweet_info" USING btree ("tweet_id");--> statement-breakpoint
CREATE INDEX "screen_name_idx" ON "site_tweet_users" USING btree ("screen_name");--> statement-breakpoint
CREATE INDEX "flag_idx" ON "site_tweet_users" USING btree ("flag");--> statement-breakpoint
CREATE INDEX "rest_id_idx" ON "site_tweet_users" USING btree ("rest_id");--> statement-breakpoint
CREATE INDEX "profiles_id_idx" ON "site_watchlist" USING btree ("profiles_id");--> statement-breakpoint
CREATE INDEX "tweet_user_idx" ON "site_watchlist" USING btree ("tweet_user");