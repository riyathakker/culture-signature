-- Add nullable `city` to Exhibition (resolved via reverse-geocoding on save).
ALTER TABLE "Exhibition" ADD COLUMN IF NOT EXISTS "city" TEXT;
