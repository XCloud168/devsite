ALTER TABLE "site_tweet_users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
CREATE INDEX "flag_idx" ON "site_tweet_users" USING btree ("flag");