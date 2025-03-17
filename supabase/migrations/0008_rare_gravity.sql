DROP INDEX "profiles_id_idx";--> statement-breakpoint
DROP INDEX "tweet_user_idx";--> statement-breakpoint
ALTER TABLE "site_watchlist" ALTER COLUMN "profiles_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_watchlist" ALTER COLUMN "tweet_user" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_profile_tweet" ON "site_watchlist" USING btree ("profiles_id","tweet_user");