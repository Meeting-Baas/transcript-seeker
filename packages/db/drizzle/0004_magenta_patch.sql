ALTER TYPE "public"."api_key_type" ADD VALUE 'google-oauth-client-id' BEFORE 'gladia';--> statement-breakpoint
ALTER TYPE "public"."api_key_type" ADD VALUE 'google-oauth-client-secret' BEFORE 'gladia';--> statement-breakpoint
ALTER TYPE "public"."api_key_type" ADD VALUE 'google-oauth-refresh-token' BEFORE 'gladia';