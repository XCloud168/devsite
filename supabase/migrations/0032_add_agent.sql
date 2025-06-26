ALTER TABLE "site_profiles" ADD COLUMN "last_points_date" varchar(10);--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "agent_code" varchar(10);--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "referrer_code" varchar(10);--> statement-breakpoint
CREATE INDEX "agent_code_idx" ON "site_profiles" USING btree ("agent_code");--> statement-breakpoint
CREATE INDEX "referrer_code_idx" ON "site_profiles" USING btree ("referrer_code");--> statement-breakpoint
ALTER TABLE "site_profiles" ADD CONSTRAINT "site_profiles_agent_code_unique" UNIQUE("agent_code");