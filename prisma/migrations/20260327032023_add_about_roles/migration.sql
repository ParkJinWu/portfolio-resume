-- AlterTable
ALTER TABLE "abouts" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[];
