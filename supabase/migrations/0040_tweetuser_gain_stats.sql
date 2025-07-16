CREATE TABLE "site_tweet_user_gain_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period" varchar(10) NOT NULL,
	"signals_count" integer DEFAULT 0,
	"max_high_rate" numeric(10, 2) DEFAULT '0',
	"max_high_rate_proj" uuid,
	"max_high_rate_proj_symbol" varchar(32),
	"max_high_rate_proj_logo" varchar(1024),
	"positive_rate_pct" numeric(5, 2) DEFAULT '0',
	"stat_time" timestamp with time zone DEFAULT now(),
	"name" varchar(255),
	"screen_name" varchar(255),
	"avatar" varchar(1024),
	"followers_count" integer
);
--> statement-breakpoint
CREATE INDEX "tweet_user_gain_stats_user_period_idx" ON "site_tweet_user_gain_stats" USING btree ("user_id","period");--> statement-breakpoint
CREATE INDEX "tweet_user_gain_stats_period_idx" ON "site_tweet_user_gain_stats" USING btree ("period");