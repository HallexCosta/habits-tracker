/*
  Warnings:

  - A unique constraint covering the columns `[user_id,day_id]` on the table `user_days` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "habits_user_id_key";

-- DropIndex
DROP INDEX "user_days_day_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_days_user_id_day_id_key" ON "user_days"("user_id", "day_id");
