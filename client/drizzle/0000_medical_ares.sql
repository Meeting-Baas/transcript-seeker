CREATE TYPE "public"."type" AS ENUM('meetingbaas', 'gladia', 'assemblyai');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" serial NOT NULL,
	"type" "type",
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meetings" (
	"id" serial NOT NULL,
	"name" text,
	"bot_id" text NOT NULL,
	"attendees" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
