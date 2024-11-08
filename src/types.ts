export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  name: string;
  capacity: number;
  enrolledStudents: string[];
}

export interface AppState {
  students: Student[];
  courses: Course[];
}

export interface Theme {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  danger: string;
  dangerHover: string;
  success: string;
  successHover: string;
  background: string;
  foreground: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
}