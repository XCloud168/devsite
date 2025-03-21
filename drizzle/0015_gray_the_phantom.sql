CREATE TABLE "site_news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"content_summary" text,
	"source" text,
	"deal_status" boolean DEFAULT false,
	"sentiment" varchar(255),
	"project_id" uuid,
	"news_entity_id" uuid,
	"symbols" json DEFAULT '[]'::json,
	"contract_address" json DEFAULT '[]'::json,
	"signal_time" timestamp with time zone,
	"signal_price" numeric(24, 12) DEFAULT '0',
	"high_rate_24h" numeric(10, 2) DEFAULT '0',
	"low_rate_24h" numeric(10, 2) DEFAULT '0',
	"high_price_24h" numeric(24, 12) DEFAULT '0',
	"low_price_24h" numeric(24, 12) DEFAULT '0',
	"low_price_time_24h" timestamp with time zone,
	"high_price_time_24h" timestamp with time zone,
	"high_rate_7d" numeric(10, 2) DEFAULT '0',
	"low_rate_7d" numeric(10, 2) DEFAULT '0',
	"high_price_7d" numeric(24, 12) DEFAULT '0',
	"low_price_7d" numeric(24, 12) DEFAULT '0',
	"low_price_time_7d" timestamp with time zone,
	"high_price_time_7d" timestamp with time zone,
	"high_rate_30d" numeric(10, 2) DEFAULT '0',
	"low_rate_30d" numeric(10, 2) DEFAULT '0',
	"high_price_30d" numeric(24, 12) DEFAULT '0',
	"low_price_30d" numeric(24, 12) DEFAULT '0',
	"low_price_time_30d" timestamp with time zone,
	"high_price_time_30d" timestamp with time zone,
	"date_created" timestamp with time zone DEFAULT now(),
	"date_updated" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "site_news" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_news_entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" text,
	"description" text,
	"website" varchar(255),
	"api_endpoint" varchar(255),
	"is_active" boolean DEFAULT true,
	"date_created" timestamp with time zone DEFAULT now(),
	CONSTRAINT "site_news_entity_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "site_news_entity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_signals_tag" RENAME TO "site_signals_category";--> statement-breakpoint
ALTER TABLE "site_signals" RENAME COLUMN "signals_tag_id" TO "category_id";--> statement-breakpoint
ALTER TABLE "site_signals" DROP CONSTRAINT "site_signals_signals_tag_id_site_signals_tag_id_fk";
--> statement-breakpoint
ALTER TABLE "site_signals" ALTER COLUMN "provider_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_news" ADD CONSTRAINT "site_news_project_id_site_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_news" ADD CONSTRAINT "site_news_news_entity_id_site_news_entity_id_fk" FOREIGN KEY ("news_entity_id") REFERENCES "public"."site_news_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_title_idx" ON "site_news" USING btree ("title");--> statement-breakpoint
CREATE INDEX "news_entity_id_idx" ON "site_news" USING btree ("news_entity_id");--> statement-breakpoint
CREATE INDEX "news_entity_name_idx" ON "site_news_entity" USING btree ("name");--> statement-breakpoint
ALTER TABLE "site_signals" ADD CONSTRAINT "site_signals_category_id_site_signals_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."site_signals_category"("id") ON DELETE no action ON UPDATE no action;