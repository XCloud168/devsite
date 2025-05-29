CREATE INDEX "project_id_idx" ON "site_signals" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "category_id_idx" ON "site_signals" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "entity_id_idx" ON "site_signals" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "category_and_provider_type_and_entity_id_idx" ON "site_signals" USING btree ("category_id","provider_type","entity_id");--> statement-breakpoint
CREATE INDEX "category_and_provider_type_idx" ON "site_signals" USING btree ("category_id","provider_type");--> statement-breakpoint
CREATE INDEX "category_and_signal_time_idx" ON "site_signals" USING btree ("category_id","signal_time");--> statement-breakpoint
CREATE INDEX "project_and_entity_and_signal_time_idx" ON "site_signals" USING btree ("project_id","entity_id","signal_time");--> statement-breakpoint
CREATE INDEX "project_and_signal_time_idx" ON "site_tweet_info" USING btree ("project_id","signal_time");