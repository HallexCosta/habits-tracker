-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users_firebase" (
    "firebase_uid" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "users_firebase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_users_firebase" ("firebase_uid", "provider", "user_id") SELECT "firebase_uid", "provider", "user_id" FROM "users_firebase";
DROP TABLE "users_firebase";
ALTER TABLE "new_users_firebase" RENAME TO "users_firebase";
CREATE UNIQUE INDEX "users_firebase_user_id_key" ON "users_firebase"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
