DROP INDEX "provider_id_idx";--> statement-breakpoint
DROP INDEX "project_id_idx";--> statement-breakpoint
DROP INDEX "category_id_idx";--> statement-breakpoint
DROP INDEX "entity_id_idx";--> statement-breakpoint
CREATE INDEX "project_id_idx" ON "site_announcement" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "news_project_id_idx" ON "site_news" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "address_idx" ON "site_payment_addresses" USING btree ("address");--> statement-breakpoint
CREATE INDEX "chain_idx" ON "site_payment_addresses" USING btree ("chain");--> statement-breakpoint
CREATE INDEX "enabled_idx" ON "site_payment_addresses" USING btree ("enabled");--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "site_payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_receiver_address_idx" ON "site_payments" USING btree ("receiver_address");--> statement-breakpoint
CREATE INDEX "payments_chain_idx" ON "site_payments" USING btree ("chain");--> statement-breakpoint
CREATE INDEX "payments_plan_type_idx" ON "site_payments" USING btree ("plan_type");--> statement-breakpoint
CREATE INDEX "email_idx" ON "site_profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "signals_provider_id_idx" ON "site_signals" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "signals_project_id_idx" ON "site_signals" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "signals_category_id_idx" ON "site_signals" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "signals_entity_id_idx" ON "site_signals" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "tweet_info_project_id_idx" ON "site_tweet_info" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "tweet_info_tweet_user_id_idx" ON "site_tweet_info" USING btree ("tweet_user_id");--> statement-breakpoint
CREATE INDEX "tweet_info_reply_tweet_id_idx" ON "site_tweet_info" USING btree ("reply_tweet_id");--> statement-breakpoint
CREATE INDEX "tweet_info_retweet_tweet_id_idx" ON "site_tweet_info" USING btree ("retweet_tweet_id");--> statement-breakpoint
CREATE INDEX "quoted_tweet_idx" ON "site_tweet_info" USING btree ("quoted_tweet");