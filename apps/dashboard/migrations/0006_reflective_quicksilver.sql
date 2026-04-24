ALTER TABLE "affiliate" ADD COLUMN "promotion_methods" text[];--> statement-breakpoint
ALTER TABLE "affiliate" ADD COLUMN "promotion_details" text;--> statement-breakpoint
ALTER TABLE "affiliate" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "affiliate" ADD COLUMN "social_handle" text;--> statement-breakpoint
ALTER TABLE "affiliate" ADD COLUMN "accepted_tos_at" timestamp;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "ask_promotion_method" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "ask_website_url" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "ask_social_handle" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "show_tos" boolean DEFAULT false NOT NULL;