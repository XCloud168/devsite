ALTER TABLE "site_announcement" ADD COLUMN "is_accurate" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD COLUMN "accuracy_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "site_news" ADD COLUMN "is_accurate" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "site_news" ADD COLUMN "accuracy_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "is_accurate" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "accuracy_rate" numeric(5, 2);