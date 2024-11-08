import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./academic.db');
export const db = drizzle(sqlite, { schema });


export const initializeDatabase = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      age INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      PRIMARY KEY (student_id, course_id)
    );
  `);
};