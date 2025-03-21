ALTER TABLE "site_signals_category" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_signals_category" ADD CONSTRAINT "site_signals_category_code_unique" UNIQUE("code");