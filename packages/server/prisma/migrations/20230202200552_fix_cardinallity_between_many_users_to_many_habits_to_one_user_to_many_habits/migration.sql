/*
  Warnings:

  - You are about to drop the `user_habits` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_habits_user_id_habit_id_key";

-- DropIndex
DROP INDEX "user_habits_habit_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_habits";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
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
