/*
  Warnings:

  - You are about to drop the column `user_id` on the `days` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "user_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_days_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "days_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_days" ("date", "id") SELECT "date", "id" FROM "days";
DROP TABLE "days";
ALTER TABLE "new_days" RENAME TO "days";
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_days_day_id_key" ON "user_days"("day_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_days_user_id_key" ON "user_days"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_days_day_id_user_id_key" ON "user_days"("day_id", "user_id");
