ALTER TABLE "site_profiles" ADD COLUMN "total" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "balance" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
CREATE INDEX "total_idx" ON "site_profiles" USING btree ("total");--> statement-breakpoint
CREATE INDEX "balance_idx" ON "site_profiles" USING btree ("balance");