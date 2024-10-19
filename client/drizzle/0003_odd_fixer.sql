CREATE TYPE "public"."status" AS ENUM('loaded', 'loading', 'error');--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "type" "type";--> statement-breakpoint
ALTER TABLE "meetings" ADD COLUMN "status" "status";--> statement-breakpoint
ALTER TABLE "public"."api_keys" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."meetings" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."type";--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('meetingbaas', 'local');--> statement-breakpoint
ALTER TABLE "public"."api_keys" ALTER COLUMN "type" SET DATA TYPE "public"."type" USING "type"::"public"."type";--> statement-breakpoint
ALTER TABLE "public"."meetings" ALTER COLUMN "type" SET DATA TYPE "public"."type" USING "type"::"public"."type";