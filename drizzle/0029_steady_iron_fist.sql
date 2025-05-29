CREATE INDEX "deal_status_idx" ON "site_announcement" USING btree ("deal_status");--> statement-breakpoint
CREATE INDEX "signals_provider_type_idx" ON "site_signals" USING btree ("provider_type");--> statement-breakpoint
CREATE INDEX "shilling_idx" ON "site_tweet_info" USING btree ("shilling");