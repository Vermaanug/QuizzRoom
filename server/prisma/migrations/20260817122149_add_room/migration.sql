-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('waiting', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "host_user_id" UUID NOT NULL,
    "invite_token" TEXT NOT NULL,
    "allow_anonymous" BOOLEAN NOT NULL DEFAULT true,
    "status" "RoomStatus" NOT NULL DEFAULT 'waiting',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_invite_token_key" ON "rooms"("invite_token");

-- CreateIndex
CREATE INDEX "rooms_quiz_id_idx" ON "rooms"("quiz_id");

-- CreateIndex
CREATE INDEX "rooms_host_user_id_idx" ON "rooms"("host_user_id");

-- CreateIndex
CREATE INDEX "rooms_status_idx" ON "rooms"("status");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
