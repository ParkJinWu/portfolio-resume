-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "end_date" TEXT,
ADD COLUMN     "start_date" TEXT;
