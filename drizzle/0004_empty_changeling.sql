ALTER TABLE "site_tweet_users" DROP CONSTRAINT "site_tweet_users_user_created_users_id_fk";
--> statement-breakpoint
ALTER TABLE "site_tweet_users" DROP CONSTRAINT "site_tweet_users_user_updated_users_id_fk";
--> statement-breakpoint
ALTER TABLE "site_tweet_users" DROP COLUMN "user_created";--> statement-breakpoint
ALTER TABLE "site_tweet_users" DROP COLUMN "user_updated";