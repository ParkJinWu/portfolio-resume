-- AlterTable
ALTER TABLE "abouts" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
