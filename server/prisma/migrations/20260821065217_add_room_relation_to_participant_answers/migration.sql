/*
  Warnings:

  - Added the required column `room_id` to the `participant_answers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "participant_answers_participant_id_idx";

-- DropIndex
DROP INDEX "participant_answers_question_id_idx";

-- AlterTable
ALTER TABLE "participant_answers" ADD COLUMN     "room_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "participant_answers_room_id_idx" ON "participant_answers"("room_id");

-- AddForeignKey
ALTER TABLE "participant_answers" ADD CONSTRAINT "participant_answers_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
