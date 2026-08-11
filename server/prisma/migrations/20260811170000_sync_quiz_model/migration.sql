-- Remove fields no longer present in the Prisma model
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "description";
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "questions_count";
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "rooms_played";
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "is_archived";
ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "published_at";

DROP INDEX IF EXISTS "quizzes_slug_key";
