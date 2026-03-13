-- Convert all completed events to confirmed
UPDATE "events" SET "status" = 'confirmed' WHERE "status" = 'completed';

-- Remove the completed value from the enum
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
CREATE TYPE "EventStatus" AS ENUM ('draft', 'confirmed', 'cancelled');
ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "events" ALTER COLUMN "status" TYPE "EventStatus" USING ("status"::text::"EventStatus");
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'draft';
DROP TYPE "EventStatus_old";
