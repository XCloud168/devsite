DROP INDEX "flag_idx";--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD COLUMN "user_type" varchar(255);--> statement-breakpoint
CREATE INDEX "user_type_idx" ON "site_tweet_users" USING btree ("user_type");--> statement-breakpoint
ALTER TABLE "site_tweet_users" DROP COLUMN "flag";