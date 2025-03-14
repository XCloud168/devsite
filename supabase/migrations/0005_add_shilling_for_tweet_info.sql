ALTER TABLE "site_tweet_users" DROP CONSTRAINT "site_tweet_users_screen_name_unique";--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "shilling" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "site_tweet_users" ADD CONSTRAINT "site_tweet_users_rest_id_unique" UNIQUE("rest_id");