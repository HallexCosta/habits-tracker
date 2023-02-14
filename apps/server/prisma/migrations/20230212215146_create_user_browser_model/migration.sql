/*
  Warnings:

  - You are about to drop the `user_notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_notifications";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user_browsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "browser_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_browsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_browsers_user_id_browser_id_key" ON "user_browsers"("user_id", "browser_id");
