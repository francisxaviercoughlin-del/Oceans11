import type { SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from './schema';

type UserVersionRow = {
  user_version: number;
};

const migrations: Record<number, string> = {
  1: `
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
        CHECK (length(trim(name)) > 0),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS course_holes (
      course_id TEXT NOT NULL,
      hole_number INTEGER NOT NULL
        CHECK (hole_number BETWEEN 1 AND 18),
      par INTEGER NOT NULL
        CHECK (par BETWEEN 3 AND 5),
      stroke_index INTEGER NOT NULL
        CHECK (stroke_index BETWEEN 1 AND 18),
      PRIMARY KEY (course_id, hole_number),
      UNIQUE (course_id, stroke_index),
      FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_courses_name
      ON courses(name COLLATE NOCASE);
  `,
};

export async function migrateDatabase(
  database: SQLiteDatabase,
): Promise<void> {
  await database.execAsync(
    'PRAGMA foreign_keys = ON;',
  );

  await database.execAsync(
    'PRAGMA journal_mode = WAL;',
  );

  const versionRow =
    await database.getFirstAsync<UserVersionRow>(
      'PRAGMA user_version;',
    );

  let currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      `Database version ${currentVersion} is newer than supported version ${DATABASE_VERSION}.`,
    );
  }

  while (currentVersion < DATABASE_VERSION) {
    const nextVersion = currentVersion + 1;
    const migration = migrations[nextVersion];

    if (!migration) {
      throw new Error(
        `Missing database migration for version ${nextVersion}.`,
      );
    }

    await database.withExclusiveTransactionAsync(
      async (transaction) => {
        await transaction.execAsync(migration);

        await transaction.execAsync(
          `PRAGMA user_version = ${nextVersion};`,
        );
      },
    );

    currentVersion = nextVersion;
  }
}
