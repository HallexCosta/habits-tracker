/*
  Warnings:

  - You are about to drop the column `userId` on the `days` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_days_day_id_user_id_key";

-- DropIndex
DROP INDEX "user_days_user_id_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_days" ("date", "id") SELECT "date", "id" FROM "days";
DROP TABLE "days";
ALTER TABLE "new_days" RENAME TO "days";
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");
CREATE TABLE "new_user_details" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_details" ("firebase_uid", "provider", "user_id") SELECT "firebase_uid", "provider", "user_id" FROM "user_details";
DROP TABLE "user_details";
ALTER TABLE "new_user_details" RENAME TO "user_details";
CREATE UNIQUE INDEX "user_details_user_id_key" ON "user_details"("user_id");
CREATE UNIQUE INDEX "user_details_user_id_firebase_uid_key" ON "user_details"("user_id", "firebase_uid");
CREATE TABLE "new_user_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "user_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_habits" ("habit_id", "id", "user_id") SELECT "habit_id", "id", "user_id" FROM "user_habits";
DROP TABLE "user_habits";
ALTER TABLE "new_user_habits" RENAME TO "user_habits";
CREATE UNIQUE INDEX "user_habits_habit_id_key" ON "user_habits"("habit_id");
CREATE UNIQUE INDEX "user_habits_user_id_habit_id_key" ON "user_habits"("user_id", "habit_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
