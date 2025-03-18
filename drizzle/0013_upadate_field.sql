ALTER TABLE "site_announcement" RENAME COLUMN "projects_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "site_announcement" DROP CONSTRAINT "site_announcement_projects_id_site_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "site_projects" ADD COLUMN "other_contract" varchar(255);--> statement-breakpoint
ALTER TABLE "site_signals" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "site_announcement" ADD CONSTRAINT "site_announcement_project_id_site_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."site_projects"("id") ON DELETE no action ON UPDATE no action;