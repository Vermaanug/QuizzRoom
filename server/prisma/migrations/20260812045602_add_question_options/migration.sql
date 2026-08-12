/*
  Warnings:

  - You are about to drop the column `position` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `time_limit` on the `questions` table. All the data in the column will be lost.
  - Added the required column `correct_option` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_a` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_b` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_c` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_d` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_index` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_limit_seconds` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "questions_quiz_id_position_idx";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "position",
DROP COLUMN "prompt",
DROP COLUMN "time_limit",
ADD COLUMN     "code_snippet" TEXT,
ADD COLUMN     "correct_option" TEXT NOT NULL,
ADD COLUMN     "option_a" TEXT NOT NULL,
ADD COLUMN     "option_b" TEXT NOT NULL,
ADD COLUMN     "option_c" TEXT NOT NULL,
ADD COLUMN     "option_d" TEXT NOT NULL,
ADD COLUMN     "order_index" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "time_limit_seconds" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "questions_quiz_id_order_index_idx" ON "questions"("quiz_id", "order_index");
