CREATE TABLE "site_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_income_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"payment_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_income_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_withdrawal_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(255) DEFAULT 'pending' NOT NULL,
	"wallet_address" varchar(255),
	"tx_hash" varchar(255),
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_withdrawal_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_income_records" ADD CONSTRAINT "site_income_records_user_id_site_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."site_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_income_records" ADD CONSTRAINT "site_income_records_payment_id_site_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."site_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_withdrawal_records" ADD CONSTRAINT "site_withdrawal_records_user_id_site_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."site_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "income_records_user_id_idx" ON "site_income_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "income_records_payment_id_idx" ON "site_income_records" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "income_records_created_at_idx" ON "site_income_records" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "withdrawal_records_user_id_idx" ON "site_withdrawal_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "withdrawal_records_status_idx" ON "site_withdrawal_records" USING btree ("status");--> statement-breakpoint
CREATE INDEX "withdrawal_records_created_at_idx" ON "site_withdrawal_records" USING btree ("created_at");