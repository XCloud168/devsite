DROP TABLE "site_contract_address" CASCADE;--> statement-breakpoint
DROP TABLE "site_project_urls" CASCADE;--> statement-breakpoint
ALTER TABLE "site_announcement" RENAME COLUMN "is_deal" TO "deal_status";--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "projects" TO "projects_id";--> statement-breakpoint
ALTER TABLE "site_tweet_info" RENAME COLUMN "is_deal" TO "deal_status";--> statement-breakpoint
ALTER TABLE "site_announcement" ADD COLUMN "analysis_result" text;--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "sol_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "eth_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "bsc_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "tron_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "base_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "blast_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "urls" json;--> statement-breakpoint
ALTER TABLE "site_tweet_info" ADD COLUMN "analysis_result" text;--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sol_contract_idx" ON "site_projects" USING btree ("sol_contract");--> statement-breakpoint
CREATE INDEX "eth_contract_idx" ON "site_projects" USING btree ("eth_contract");--> statement-breakpoint
CREATE INDEX "bsc_contract_idx" ON "site_projects" USING btree ("bsc_contract");--> statement-breakpoint
CREATE INDEX "tron_contract_idx" ON "site_projects" USING btree ("tron_contract");--> statement-breakpoint
CREATE INDEX "base_contract_idx" ON "site_projects" USING btree ("base_contract");--> statement-breakpoint
CREATE INDEX "blast_contract_idx" ON "site_projects" USING btree ("blast_contract");--> statement-breakpoint
ALTER TABLE "site_projects" DROP COLUMN "third_id";--> statement-breakpoint
ALTER TABLE "site_tweet_info" DROP COLUMN "status";