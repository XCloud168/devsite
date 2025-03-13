ALTER TABLE "site_announcement" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "site_watchlist" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();