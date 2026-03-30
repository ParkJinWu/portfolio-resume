-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nav_title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sections_key_key" ON "sections"("key");

-- Seed initial sections
INSERT INTO "sections" ("id", "key", "title", "nav_title", "order", "visible", "created_at", "updated_at")
VALUES
    (gen_random_uuid()::text, 'about',      '소개',      'About',      0, true, NOW(), NOW()),
    (gen_random_uuid()::text, 'experience', '경력',      'Experience', 1, true, NOW(), NOW()),
    (gen_random_uuid()::text, 'skills',     '기술',      'Skills',     2, true, NOW(), NOW()),
    (gen_random_uuid()::text, 'projects',   '프로젝트',  'Projects',   3, true, NOW(), NOW()),
    (gen_random_uuid()::text, 'education',  '학력',      'Education',  4, true, NOW(), NOW()),
    (gen_random_uuid()::text, 'contact',    '연락처',    'Contact',    5, true, NOW(), NOW());
