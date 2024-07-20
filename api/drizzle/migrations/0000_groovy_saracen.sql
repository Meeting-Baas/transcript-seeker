CREATE TABLE IF NOT EXISTS "meetings" (
	"id" serial NOT NULL,
	"name" text,
	"bot_id" text,
	"role" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
