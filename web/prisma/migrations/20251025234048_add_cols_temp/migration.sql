/*
  Warnings:

  - You are about to drop the column `amount` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `records` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."records" DROP CONSTRAINT "records_user_id_fkey";

-- AlterTable
ALTER TABLE "records" DROP COLUMN "amount",
DROP COLUMN "user_id",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TransactionItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TransactionItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TransactionItems_B_index" ON "_TransactionItems"("B");

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransactionItems" ADD CONSTRAINT "_TransactionItems_A_fkey" FOREIGN KEY ("A") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransactionItems" ADD CONSTRAINT "_TransactionItems_B_fkey" FOREIGN KEY ("B") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
