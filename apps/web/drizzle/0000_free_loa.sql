CREATE TYPE "public"."api_key_type" AS ENUM('meetingbaas', 'gladia', 'openai', 'assemblyai');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('loaded', 'loading', 'error');--> statement-breakpoint
CREATE TYPE "public"."meeting_type" AS ENUM('meetingbaas', 'local');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" serial NOT NULL,
	"type" "api_key_type",
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meetings" (
	"id" serial NOT NULL,
	"type" "meeting_type",
	"name" text,
	"bot_id" text NOT NULL,
	"attendees" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" "meeting_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
