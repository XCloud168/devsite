ALTER TABLE "site_signals" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "enable_notification" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "site_profiles" ADD COLUMN "notification_sound" varchar(256);