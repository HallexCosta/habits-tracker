-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habit_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habit_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_habit_week_days" ("habit_id", "id", "week_day") SELECT "habit_id", "id", "week_day" FROM "habit_week_days";
DROP TABLE "habit_week_days";
ALTER TABLE "new_habit_week_days" RENAME TO "habit_week_days";
CREATE UNIQUE INDEX "habit_week_days_habit_id_week_day_key" ON "habit_week_days"("habit_id", "week_day");
CREATE TABLE "new_user_browsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "browser_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_browsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_browsers" ("browser_id", "id", "user_id") SELECT "browser_id", "id", "user_id" FROM "user_browsers";
DROP TABLE "user_browsers";
ALTER TABLE "new_user_browsers" RENAME TO "user_browsers";
CREATE UNIQUE INDEX "user_browsers_user_id_browser_id_key" ON "user_browsers"("user_id", "browser_id");
CREATE TABLE "new_day_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "day_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "day_habits_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_day_habits" ("day_id", "habit_id", "id") SELECT "day_id", "habit_id", "id" FROM "day_habits";
DROP TABLE "day_habits";
ALTER TABLE "new_day_habits" RENAME TO "day_habits";
CREATE UNIQUE INDEX "day_habits_day_id_habit_id_key" ON "day_habits"("day_id", "habit_id");
CREATE TABLE "new_user_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    CONSTRAINT "user_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_days_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_days" ("day_id", "id", "user_id") SELECT "day_id", "id", "user_id" FROM "user_days";
DROP TABLE "user_days";
ALTER TABLE "new_user_days" RENAME TO "user_days";
CREATE UNIQUE INDEX "user_days_user_id_day_id_key" ON "user_days"("user_id", "day_id");
CREATE TABLE "new_user_details" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_details" ("firebase_uid", "provider", "user_id") SELECT "firebase_uid", "provider", "user_id" FROM "user_details";
DROP TABLE "user_details";
ALTER TABLE "new_user_details" RENAME TO "user_details";
CREATE UNIQUE INDEX "user_details_user_id_key" ON "user_details"("user_id");
CREATE UNIQUE INDEX "user_details_user_id_firebase_uid_key" ON "user_details"("user_id", "firebase_uid");
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_habits" ("created_at", "id", "title", "user_id") SELECT "created_at", "id", "title", "user_id" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
