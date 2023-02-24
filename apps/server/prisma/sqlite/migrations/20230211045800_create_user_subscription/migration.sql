-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_notifications_user_id_subscription_id_key" ON "user_notifications"("user_id", "subscription_id");
