-- CreateEnum
CREATE TYPE "ParticipantConnectionStatus" AS ENUM ('connected', 'disconnected');

-- CreateTable
CREATE TABLE "participants" (
    "id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "user_id" UUID,
    "display_name" VARCHAR(50) NOT NULL,
    "connection_status" "ParticipantConnectionStatus" NOT NULL DEFAULT 'connected',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnected_at" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "participants_room_id_idx" ON "participants"("room_id");

-- CreateIndex
CREATE INDEX "participants_room_id_user_id_idx" ON "participants"("room_id", "user_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
