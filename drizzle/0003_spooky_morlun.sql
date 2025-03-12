ALTER TABLE "site_tweet_info" ADD COLUMN "signal_price" numeric(24, 12);--> statement-breakpoint
ALTER TABLE "site_signals" DROP COLUMN "sentiment";--> statement-breakpoint
ALTER TABLE "site_signals" DROP COLUMN "signal_price";