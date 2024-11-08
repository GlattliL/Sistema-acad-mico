import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  age: integer('age').notNull()
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  capacity: integer('capacity').notNull()
});

export const enrollments = sqliteTable('enrollments', {
  studentId: text('student_id')
    .notNull()
    .references(() => students.id),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id),
}, (table) => ({
  pk: text('primary_key').primaryKey().$defaultFn(() => `${table.studentId}_${table.courseId}`)
}));