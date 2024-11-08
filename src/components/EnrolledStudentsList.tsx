import React from 'react';
import { Student, Course, Theme } from '../types';
import { UserSquare2 } from 'lucide-react';

interface EnrolledStudentsListProps {
  course: Course;
  students: Student[];
  theme: Theme;
  onClose: () => void;
}

export function EnrolledStudentsList({ course, students, theme, onClose }: EnrolledStudentsListProps) {
  const enrolledStudents = students.filter(student => 
    course.enrolledStudents.includes(student.id)
  );

  return (
    <div className="space-y-4">
      <div className={`rounded-lg ${theme.secondary} p-4 mb-4`}>
        <p className={`text-sm ${theme.text}`}>
          {enrolledStudents.length} de {course.capacity} estudiantes inscritos
        </p>
      </div>
      
      {enrolledStudents.length > 0 ? (
        <div className="space-y-2">
          {enrolledStudents.map(student => (
            <div
              key={student.id}
              className={`flex items-center p-3 rounded-lg ${theme.secondary}`}
            >
              <UserSquare2 className={`h-5 w-5 mr-3 ${theme.text}`} />
              <div>
                <p className={`font-medium ${theme.text}`}>
                  {student.firstName} {student.lastName}
                </p>
                <p className={`text-sm ${theme.textSecondary}`}>
                  {student.age} años
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-center ${theme.textSecondary}`}>
          No hay estudiantes inscritos en esta materia
        </p>
      )}
    </div>
  );
}