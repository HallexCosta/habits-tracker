/*
  Warnings:

  - You are about to drop the column `user_firebase_id` on the `users` table. All the data in the column will be lost.
  - The primary key for the `users_firebase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_firebase_id` on the `users_firebase` table. All the data in the column will be lost.
  - Added the required column `firebase_uid` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebase_uid` to the `users_firebase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "photoURL" TEXT,
    "firebase_uid" TEXT NOT NULL
);
INSERT INTO "new_users" ("email", "id", "name", "password", "photoURL") SELECT "email", "id", "name", "password", "photoURL" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_firebase_uid_key" ON "users"("email", "firebase_uid");
CREATE TABLE "new_users_firebase" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "users_firebase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users_firebase" ("provider", "user_id") SELECT "provider", "user_id" FROM "users_firebase";
DROP TABLE "users_firebase";
ALTER TABLE "new_users_firebase" RENAME TO "users_firebase";
CREATE UNIQUE INDEX "users_firebase_user_id_key" ON "users_firebase"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
