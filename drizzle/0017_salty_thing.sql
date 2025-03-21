ALTER TABLE "site_signals_category" ALTER COLUMN "date_updated" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_signals_category" ALTER COLUMN "date_updated" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "site_signals_category" ALTER COLUMN "date_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_signals_category" ADD COLUMN "date_created" timestamp with time zone DEFAULT now() NOT NULL;