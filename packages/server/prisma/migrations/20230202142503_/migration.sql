/*
  Warnings:

  - You are about to drop the `users_firebase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `user_id` on the `habits` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_firebase_user_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users_firebase";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user_details" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "user_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);
INSERT INTO "new_habits" ("created_at", "id", "title") SELECT "created_at", "id", "title" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_details_user_id_key" ON "user_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_habits_user_id_habit_id_key" ON "user_habits"("user_id", "habit_id");
