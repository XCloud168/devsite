DROP INDEX "exchange_id_idx";--> statement-breakpoint
DROP INDEX "project_id_idx";--> statement-breakpoint
CREATE INDEX "announcement_exchange_id_idx" ON "site_announcement" USING btree ("exchange_id");--> statement-breakpoint
CREATE INDEX "announcement_project_id_idx" ON "site_announcement" USING btree ("project_id");