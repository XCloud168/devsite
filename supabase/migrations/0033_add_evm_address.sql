ALTER TABLE "site_profiles" ADD COLUMN "evm_address" varchar(255);--> statement-breakpoint
CREATE INDEX "evm_address_idx" ON "site_profiles" USING btree ("evm_address");