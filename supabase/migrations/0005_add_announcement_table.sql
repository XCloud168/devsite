CREATE TABLE "site_announcement" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"content" text,
	"is_deal" boolean DEFAULT false,
	"date_created" timestamp with time zone DEFAULT now(),
	"projects_id" uuid,
	"status" varchar(255) DEFAULT 'draft',
	"sentiment" varchar(255),
	"signal_time" timestamp with time zone,
	"signal_price" numeric(24, 12),
	"high_rate_24h" numeric(10, 2) DEFAULT '0',
	"low_rate_24h" numeric(10, 2) DEFAULT '0',
	"high_price_24h" numeric(24, 12),
	"low_price_24h" numeric(24, 12),
	"low_price_time_24h" timestamp with time zone,
	"high_price_time_24h" timestamp with time zone,
	"high_rate_7d" numeric(10, 2) DEFAULT '0',
	"low_rate_7d" numeric(10, 2) DEFAULT '0',
	"high_price_7d" numeric(24, 12),
	"low_price_7d" numeric(24, 12),
	"low_price_time_7d" timestamp with time zone,
	"high_price_time_7d" timestamp with time zone,
	"high_rate_30d" numeric(10, 2) DEFAULT '0',
	"low_rate_30d" numeric(10, 2) DEFAULT '0',
	"high_price_30d" numeric(24, 12),
	"low_price_30d" numeric(24, 12),
	"low_price_time_30d" timestamp with time zone,
	"high_price_time_30d" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "site_announcement" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD CONSTRAINT "site_announcement_projects_id_site_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcement_title_idx" ON "site_announcement" USING btree ("title");