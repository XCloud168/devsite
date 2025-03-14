ALTER TABLE "site_payment_addresses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "ai_result" TO "ai_summary";--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "projects_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "signals_tag" TO "signals_tag_id";--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "provider" TO "provider_id";--> statement-breakpoint
ALTER TABLE "site_signals" DROP CONSTRAINT "site_signals_projects_id_site_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "site_signals" DROP CONSTRAINT "site_signals_signals_tag_site_signals_tag_id_fk";
--> statement-breakpoint
DROP INDEX "provider_idx";--> statement-breakpoint
ALTER TABLE "site_signals" ALTER COLUMN "date_created" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_signals" ALTER COLUMN "date_created" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_signals" ALTER COLUMN "signal_time" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_signals" ALTER COLUMN "signal_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_signals" ADD COLUMN "provider_type" varchar(255) DEFAULT 'twitter';--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_project_id_site_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_signals_tag_id_site_signals_tag_id_fk" FOREIGN KEY ("signals_tag_id") REFERENCES "public"."site_signals_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "provider_id_idx" ON "site_signals" USING btree ("provider_id");