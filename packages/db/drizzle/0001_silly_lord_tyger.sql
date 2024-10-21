CREATE TABLE IF NOT EXISTS "chats" (
	"id" serial NOT NULL,
	"meeting_id" serial NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
