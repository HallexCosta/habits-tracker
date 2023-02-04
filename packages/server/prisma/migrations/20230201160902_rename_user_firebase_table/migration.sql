/*
  Warnings:

  - You are about to drop the `user_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "user_details_user_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_details";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "users_firebase" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "photoURL" TEXT,
    "firebase_uid" TEXT NOT NULL,
    CONSTRAINT "users_firebase_uid_fkey" FOREIGN KEY ("firebase_uid") REFERENCES "users_firebase" ("firebase_uid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("email", "firebase_uid", "id", "name", "password", "photoURL") SELECT "email", "firebase_uid", "id", "name", "password", "photoURL" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_firebase_uid_key" ON "users"("email", "firebase_uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_user_id_key" ON "users_firebase"("user_id");
