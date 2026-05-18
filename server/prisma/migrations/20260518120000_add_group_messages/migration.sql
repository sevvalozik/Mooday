-- AlterTable: Make receiverId optional and add groupId
ALTER TABLE "Message" ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddColumn
ALTER TABLE "Message" ADD COLUMN "groupId" TEXT;

-- CreateIndex
CREATE INDEX "Message_groupId_createdAt_idx" ON "Message"("groupId", "createdAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
