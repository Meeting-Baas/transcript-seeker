ALTER TABLE "meetings" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "editors" ADD COLUMN "meeting_id" serial NOT NULL;