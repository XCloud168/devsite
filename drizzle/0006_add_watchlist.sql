CREATE TABLE "site_watchlist" (
	"id" uuid PRIMARY KEY NOT NULL,
	"profiles_id" uuid,
	"tweet_user" uuid,
	"notify_on_new_tweet" boolean DEFAULT false,
	"notify_on_new_following" boolean DEFAULT false,
	"date_created" timestamp with time zone DEFAULT now(),
	"date_updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "site_watchlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_watchlist" ADD CONSTRAINT "site_watchlist_profiles_id_site_profiles_id_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."site_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_watchlist" ADD CONSTRAINT "site_watchlist_tweet_user_site_tweet_users_id_fk" FOREIGN KEY ("tweet_user") REFERENCES "public"."site_tweet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_id_idx" ON "site_watchlist" USING btree ("profiles_id");--> statement-breakpoint
CREATE INDEX "tweet_user_idx" ON "site_watchlist" USING btree ("tweet_user");