-- CreateTable
CREATE TABLE "PurchaseRecord" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "receptUrl" TEXT NOT NULL,
    "amountInCent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "PurchaseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCent" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "stripeLink" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseRecord" ADD CONSTRAINT "PurchaseRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
