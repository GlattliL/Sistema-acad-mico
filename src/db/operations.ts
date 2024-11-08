import { db } from './index';
import { eq } from 'drizzle-orm';
import { students, courses, enrollments } from './schema';
import { Student, Course } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function getStudents(): Promise<Student[]> {
  const dbStudents = await db.select().from(students);
  const dbEnrollments = await db.select().from(enrollments);
  
  return dbStudents.map(student => ({
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    age: student.age,
    enrolledCourses: dbEnrollments
      .filter(e => e.studentId === student.id)
      .map(e => e.courseId)
  }));
}

export async function getCourses(): Promise<Course[]> {
  const dbCourses = await db.select().from(courses);
  const dbEnrollments = await db.select().from(enrollments);
  
  return dbCourses.map(course => ({
    id: course.id,
    name: course.name,
    capacity: course.capacity,
    enrolledStudents: dbEnrollments
      .filter(e => e.courseId === course.id)
      .map(e => e.studentId)
  }));
}

export async function addStudent(studentData: Omit<Student, 'id' | 'enrolledCourses'>) {
  const id = uuidv4();
  await db.insert(students).values({
    id,
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    age: studentData.age
  });
  return id;
}

export async function updateStudent(id: string, studentData: Omit<Student, 'id' | 'enrolledCourses'>) {
  await db.update(students)
    .set({
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      age: studentData.age
    })
    .where(eq(students.id, id));
}

export async function deleteStudent(id: string) {
  await db.delete(enrollments).where(eq(enrollments.studentId, id));
  await db.delete(students).where(eq(students.id, id));
}

export async function addCourse(courseData: Omit<Course, 'id' | 'enrolledStudents'>) {
  const id = uuidv4();
  await db.insert(courses).values({
    id,
    name: courseData.name,
    capacity: courseData.capacity
  });
  return id;
}

export async function updateCourse(id: string, courseData: Omit<Course, 'id' | 'enrolledStudents'>) {
  await db.update(courses)
    .set({
      name: courseData.name,
      capacity: courseData.capacity
    })
    .where(eq(courses.id, id));
}

export async function deleteCourse(id: string) {
  await db.delete(enrollments).where(eq(enrollments.courseId, id));
  await db.delete(courses).where(eq(courses.id, id));
}

export async function enrollStudent(studentId: string, courseId: string) {
  await db.insert(enrollments).values({
    studentId,
    courseId
  });
}