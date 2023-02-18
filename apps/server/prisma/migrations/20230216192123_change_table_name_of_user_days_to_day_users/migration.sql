/*
  Warnings:

  - You are about to drop the `user_days` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_days";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "day_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "day_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "day_users_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "day_users_user_id_day_id_key" ON "day_users"("user_id", "day_id");
