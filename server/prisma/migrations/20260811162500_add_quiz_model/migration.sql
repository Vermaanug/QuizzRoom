-- Enable UUID generation for Postgres
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "description" TEXT,
    "status" "QuizStatus" NOT NULL DEFAULT 'draft',
    "questions_count" INTEGER NOT NULL DEFAULT 0,
    "rooms_played" INTEGER NOT NULL DEFAULT 0,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(6) WITH TIME ZONE,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_slug_key" ON "quizzes"("slug");

-- CreateIndex
CREATE INDEX "quizzes_owner_id_status_idx" ON "quizzes"("owner_id", "status");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
