/*
  Warnings:

  - You are about to drop the column `orderId` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_orderId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orderId";
