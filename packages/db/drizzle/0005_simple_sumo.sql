ALTER TABLE "public"."api_keys" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."api_key_type";--> statement-breakpoint
CREATE TYPE "public"."api_key_type" AS ENUM('meetingbaas', 'google-client-id', 'google-client-secret', 'google-refresh-token', 'gladia', 'openai', 'assemblyai');--> statement-breakpoint
ALTER TABLE "public"."api_keys" ALTER COLUMN "type" SET DATA TYPE "public"."api_key_type" USING "type"::"public"."api_key_type";