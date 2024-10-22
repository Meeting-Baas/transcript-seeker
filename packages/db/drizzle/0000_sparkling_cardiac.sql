CREATE TYPE "public"."api_key_type" AS ENUM('meetingbaas', 'gladia', 'openai', 'assemblyai');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('loaded', 'loading', 'error');--> statement-breakpoint
CREATE TYPE "public"."meeting_type" AS ENUM('meetingbaas', 'local');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" serial NOT NULL,
	"type" "api_key_type",
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "editors" (
	"id" serial NOT NULL,
	"meeting_id" serial NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meetings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "meeting_type" NOT NULL,
	"status" "meeting_status" NOT NULL,
	"bot_id" text NOT NULL,
	"attendees" text[] DEFAULT '{}'::text[] NOT NULL,
	"transcripts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assets" jsonb DEFAULT '{"video_url":null,"video_blob":null}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
