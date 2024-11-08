import React, { useState } from 'react';
import { Student, Course, Theme } from '../types';
import { toast } from 'react-hot-toast';
import { GraduationCap, AlertCircle } from 'lucide-react';

interface EnrollmentFormProps {
  student: Student;
  availableCourses: Course[];
  onEnroll: (studentId: string, courseId: string) => void;
  theme: Theme;
}

export function EnrollmentForm({ student, availableCourses, onEnroll, theme }: EnrollmentFormProps) {
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error('Por favor seleccione una materia');
      return;
    }

    onEnroll(student.id, selectedCourse);
    setSelectedCourse('');
  };

  const remainingCoursesNeeded = Math.max(0, 3 - student.enrolledCourses.length);
  const canEnroll = student.enrolledCourses.length < 8;

  const filteredCourses = availableCourses.filter(course => 
    !student.enrolledCourses.includes(course.id) &&
    course.enrolledStudents.length < course.capacity
  );

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${theme.secondary} mb-4`}>
        <h3 className={`text-lg font-medium ${theme.text} mb-2`}>
          {student.firstName} {student.lastName}
        </h3>
        <p className={`text-sm ${theme.textSecondary}`}>
          Materias inscritas: {student.enrolledCourses.length}/8
        </p>
        <div className="mt-2">
          <AlertCircle className="inline-block mr-2 h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-500">
            El mínimo de materias de cada estudiante debe ser de 3
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            Seleccionar Materia
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 rounded-lg ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500 shadow-sm`}
          >
            <option value="">Seleccione una materia...</option>
            {filteredCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.enrolledStudents.length}/{course.capacity} estudiantes)
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!canEnroll}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${theme.success} ${theme.successHover} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <GraduationCap className="mr-2 h-4 w-4" />
          Inscribirse en la Materia
        </button>

        {remainingCoursesNeeded > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-yellow-700 text-sm">
              El alumno debe inscribirse en al menos {remainingCoursesNeeded} materia{remainingCoursesNeeded !== 1 ? 's' : ''} más
              para cumplir con el mínimo requerido.
            </p>
          </div>
        )}

        {!canEnroll && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm">
              Número máximo de materias alcanzado (8)
            </p>
          </div>
        )}
      </form>
    </div>
  );
}