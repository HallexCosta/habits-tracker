/*
  Warnings:

  - Added the required column `user_id` to the `days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_days" ("date", "id") SELECT "date", "id" FROM "days";
DROP TABLE "days";
ALTER TABLE "new_days" RENAME TO "days";
CREATE UNIQUE INDEX "days_date_user_id_key" ON "days"("date", "user_id");
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habits" ("created_at", "id", "title") SELECT "created_at", "id", "title" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
CREATE UNIQUE INDEX "habits_user_id_key" ON "habits"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
