/*
  Warnings:

  - You are about to drop the column `user_id` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `records` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."records" DROP CONSTRAINT "records_userId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "records" DROP COLUMN "userId",
ADD COLUMN     "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "phone" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
