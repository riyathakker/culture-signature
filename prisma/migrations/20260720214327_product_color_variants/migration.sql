-- DropIndex
DROP INDEX "CartItem_userId_productId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "color" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_productId_color_key" ON "CartItem"("userId", "productId", "color");

