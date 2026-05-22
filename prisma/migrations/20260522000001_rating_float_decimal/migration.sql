-- AlterTable: change rating from Int to Float to support decimal ratings (e.g. 4.5)
ALTER TABLE "Review" ALTER COLUMN "rating" TYPE DOUBLE PRECISION;
