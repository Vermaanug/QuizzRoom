-- CreateTable
CREATE TABLE "participant_answers" (
    "id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "selected_option" VARCHAR(1),
    "is_correct" BOOLEAN NOT NULL,
    "time_taken_ms" INTEGER NOT NULL,
    "answered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participant_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "participant_answers_participant_id_idx" ON "participant_answers"("participant_id");

-- CreateIndex
CREATE INDEX "participant_answers_question_id_idx" ON "participant_answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "participant_answers_participant_id_question_id_key" ON "participant_answers"("participant_id", "question_id");

-- AddForeignKey
ALTER TABLE "participant_answers" ADD CONSTRAINT "participant_answers_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_answers" ADD CONSTRAINT "participant_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
