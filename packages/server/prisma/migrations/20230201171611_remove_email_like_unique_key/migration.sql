/*
  Warnings:

  - You are about to drop the column `userId` on the `users_firebase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_firebase_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_user_firebase_id_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users_firebase" (
    "user_firebase_id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "users_firebase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users_firebase" ("provider", "user_firebase_id", "user_id") SELECT "provider", "user_firebase_id", "user_id" FROM "users_firebase";
DROP TABLE "users_firebase";
ALTER TABLE "new_users_firebase" RENAME TO "users_firebase";
CREATE UNIQUE INDEX "users_firebase_user_id_key" ON "users_firebase"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "users_user_firebase_id_key" ON "users"("user_firebase_id");
