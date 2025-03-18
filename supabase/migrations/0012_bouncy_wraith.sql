ALTER TABLE "site_tweet_info" RENAME COLUMN "tweet_user" TO "tweet_user_id";--> statement-breakpoint
ALTER TABLE "site_tweet_info" RENAME COLUMN "projects_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "site_tweet_info" DROP CONSTRAINT "site_tweet_info_tweet_user_site_tweet_users_id_fk";
--> statement-breakpoint
ALTER TABLE "site_tweet_info" DROP CONSTRAINT "site_tweet_info_projects_id_site_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_tweet_user_id_site_tweet_users_id_fk" FOREIGN KEY ("tweet_user_id") REFERENCES "public"."site_tweet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD CONSTRAINT "site_tweet_info_project_id_site_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;