ALTER TABLE "site_announcement" ADD COLUMN "content_summary" text;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD COLUMN "symbols" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD COLUMN "contract_address" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "content_summary" text;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "symbols" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "contract_address" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "site_announcement" DROP COLUMN "analysis_result";--> statement-breakpoint
ALTER TABLE "site_signals" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "site_tweet_info" DROP COLUMN "analysis_result";