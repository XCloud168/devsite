ALTER TABLE "site_signals" ADD COLUMN "is_accurate" boolean;--> statement-breakpoint
ALTER TABLE "site_signals" ADD COLUMN "accuracy_rate" numeric(5, 2);