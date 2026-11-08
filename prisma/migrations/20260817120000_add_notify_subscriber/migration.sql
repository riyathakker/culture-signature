-- CreateTable
CREATE TABLE "NotifySubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotifySubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotifySubscriber_email_key" ON "NotifySubscriber"("email");
