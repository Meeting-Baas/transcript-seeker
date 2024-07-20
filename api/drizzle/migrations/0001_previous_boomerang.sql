ALTER TABLE "meetings" ALTER COLUMN "bot_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meetings" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;