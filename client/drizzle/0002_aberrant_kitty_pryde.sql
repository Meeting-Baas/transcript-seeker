ALTER TABLE "api_keys" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN IF EXISTS "updated_at";