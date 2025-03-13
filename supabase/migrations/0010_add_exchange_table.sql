CREATE TABLE "site_exchange" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" text,
	"description" text,
	"website" varchar(255),
	"date_created" timestamp with time zone DEFAULT now(),
	CONSTRAINT "site_exchange_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "site_exchange" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD COLUMN "exchange_id" uuid;--> statement-breakpoint
CREATE INDEX "exchange_name_idx" ON "site_exchange" USING btree ("name");--> statement-breakpoint
ALTER TABLE "site_announcement" ADD CONSTRAINT "site_announcement_exchange_id_site_exchange_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."site_exchange"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exchange_id_idx" ON "site_announcement" USING btree ("exchange_id");