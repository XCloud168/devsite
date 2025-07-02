CREATE TABLE "site_system_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_name" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_system_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "system_logs_log_name_idx" ON "site_system_logs" USING btree ("log_name");--> statement-breakpoint
CREATE INDEX "system_logs_created_at_idx" ON "site_system_logs" USING btree ("created_at");