-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "waiterId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "placedAt" TIMESTAMP(3) NOT NULL,
    "specialInstructions" TEXT,
    "items" JSONB NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
