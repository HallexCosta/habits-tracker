/*
  Warnings:

  - Added the required column `firebase_uid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "user_details" (
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
    CONSTRAINT "users_firebase_uid_fkey" FOREIGN KEY ("firebase_uid") REFERENCES "user_details" ("firebase_uid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("email", "id", "name", "password", "photoURL") SELECT "email", "id", "name", "password", "photoURL" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_firebase_uid_key" ON "users"("email", "firebase_uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_details_user_id_key" ON "user_details"("user_id");
