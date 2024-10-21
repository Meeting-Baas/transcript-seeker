CREATE TABLE IF NOT EXISTS "editors" (
	"id" serial NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "transcripts" text[] DEFAULT '{}'::jsonb[] NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "assets" jsonb DEFAULT '{"video_url":null,"video_blob":null}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" DROP COLUMN IF EXISTS "editor_content";