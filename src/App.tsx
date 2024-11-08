import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { Student, Course, AppState } from './types';
import { StudentForm } from './components/StudentForm';
import { CourseForm } from './components/CourseForm';
import { EnrollmentForm } from './components/EnrollmentForm';
import { Modal } from './components/Modal';
import { EnrolledStudentsList } from './components/EnrolledStudentsList';
import { Search, Trash2, Edit, GraduationCap, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const initialState: AppState = {
  students: [],
  courses: []
};

function App() {
  const [state, setState] = useLocalStorage<AppState>('academicSystem', initialState);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'courses'>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<Course | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = { ...studentData, id: generateId() };
    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
    toast.success('Estudiante agregado exitosamente');
    setIsStudentFormOpen(false);
  };

  const updateStudent = (studentData: Omit<Student, 'id'>) => {
    if (!editingStudent) return;
    setState(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === editingStudent.id
          ? { ...studentData, id: student.id }
          : student
      )
    }));
    setEditingStudent(null);
    setIsStudentFormOpen(false);
    toast.success('Estudiante actualizado exitosamente');
  };

  const deleteStudent = (studentId: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId),
      courses: prev.courses.map(course => ({
        ...course,
        enrolledStudents: course.enrolledStudents.filter(id => id !== studentId)
      }))
    }));
    toast.success('Estudiante eliminado exitosamente');
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledStudents'>) => {
    const newCourse = {
      ...courseData,
      id: generateId(),
      enrolledStudents: []
    };
    setState(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
    toast.success('Materia agregada exitosamente');
  };

  const updateCourse = (courseData: Omit<Course, 'id' | 'enrolledStudents'>) => {
    if (!editingCourse) return;
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...courseData }
          : course
      )
    }));
    setEditingCourse(null);
    toast.success('Materia actualizada exitosamente');
  };

  const deleteCourse = (courseId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId),
      students: prev.students.map(student => ({
        ...student,
        enrolledCourses: student.enrolledCourses.filter(id => id !== courseId)
      }))
    }));
    toast.success('Materia eliminada exitosamente');
  };

  const enrollStudent = (studentId: string, courseId: string) => {
    const student = state.students.find(s => s.id === studentId);
    const course = state.courses.find(c => c.id === courseId);

    if (!student || !course) return;

    if (student.enrolledCourses.includes(courseId)) {
      toast.error('El estudiante ya está inscrito en esta materia');
      return;
    }

    if (student.enrolledCourses.length >= 8) {
      toast.error('El estudiante ya está inscrito en el máximo de materias permitidas');
      return;
    }

    if (course.enrolledStudents.length >= course.capacity) {
      toast.error('La materia ha alcanzado su capacidad máxima');
      return;
    }

    setState(prev => ({
      ...prev,
      students: prev.students.map(s =>
        s.id === studentId
          ? { ...s, enrolledCourses: [...s.enrolledCourses, courseId] }
          : s
      ),
      courses: prev.courses.map(c =>
        c.id === courseId
          ? { ...c, enrolledStudents: [...c.enrolledStudents, studentId] }
          : c
      )
    }));
    toast.success('Estudiante inscrito exitosamente');
  };

  const filteredStudents = state.students.filter(student =>
    (student.firstName + ' ' + student.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredCourses = state.courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={theme.background}>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${theme.foreground} rounded-lg shadow-lg p-6`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${theme.text}`}>
              Sistema de Gestión Académica
            </h1>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'students'
                    ? `${theme.primary} text-white`
                    : `${theme.secondary} ${theme.text}`
                }`}
              >
                Estudiantes
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'courses'
                    ? `${theme.primary} text-white`
                    : `${theme.secondary} ${theme.text}`
                }`}
              >
                Materias
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary} h-5 w-5`} />
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab === 'students' ? 'estudiantes' : 'materias'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500 shadow-sm`}
                />
              </div>
              <div className="flex space-x-2">
                {activeTab === 'students' && (
                  <button
                    onClick={() => setIsStudentFormOpen(true)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-white ${theme.primary} ${theme.primaryHover}`}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Estudiante
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeTab === 'courses' && (
              <div className="mb-6">
                <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                  Agregar Materia
                </h2>
                <CourseForm
                  onSubmit={editingCourse ? updateCourse : addCourse}
                  initialValues={editingCourse}
                  isEdit={!!editingCourse}
                  theme={theme}
                />
              </div>
            )}

            <div>
              {selectedStudent && (
                <Modal
                  isOpen={!!selectedStudent}
                  onClose={() => setSelectedStudent(null)}
                  title={`Inscribir a ${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  theme={theme}
                >
                  <EnrollmentForm
                    student={selectedStudent}
                    availableCourses={state.courses}
                    onEnroll={enrollStudent}
                    theme={theme}
                  />
                </Modal>
              )}

              {isStudentFormOpen && (
                <Modal
                  isOpen={isStudentFormOpen}
                  onClose={() => {
                    setIsStudentFormOpen(false);
                    setEditingStudent(null);
                  }}
                  title={editingStudent ? "Editar Estudiante" : "Agregar Estudiante"}
                  theme={theme}
                >
                  <StudentForm
                    onSubmit={editingStudent ? updateStudent : addStudent}
                    initialValues={editingStudent}
                    isEdit={!!editingStudent}
                    theme={theme}
                  />
                </Modal>
              )}

              {selectedCourseForStudents && (
                <Modal
                  isOpen={!!selectedCourseForStudents}
                  onClose={() => setSelectedCourseForStudents(null)}
                  title={`Estudiantes en ${selectedCourseForStudents.name}`}
                  theme={theme}
                >
                  <EnrolledStudentsList
                    course={selectedCourseForStudents}
                    students={state.students}
                    theme={theme}
                    onClose={() => setSelectedCourseForStudents(null)}
                  />
                </Modal>
              )}

              <div className={`${theme.card} rounded-lg overflow-hidden shadow-md`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme.secondary}>
                      <tr>
                        {activeTab === 'students' ? (
                          <>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Nombre</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Edad</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Materias</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Acciones</th>
                          </>
                        ) : (
                          <>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Nombre</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Capacidad</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Inscritos</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.text} uppercase tracking-wider`}>Acciones</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200 ${theme.card}`}>
                      {activeTab === 'students' ? (
                        filteredStudents.map(student => (
                          <tr key={student.id}>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {student.firstName} {student.lastName}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {student.age}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {student.enrolledCourses.length}/8
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.primary} text-white`}
                                title="Inscribir en materias"
                              >
                                <GraduationCap className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStudent(student);
                                  setIsStudentFormOpen(true);
                                }}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.secondary} ${theme.text}`}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteStudent(student.id)}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.danger} text-white`}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        filteredCourses.map(course => (
                          <tr key={course.id}>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {course.name}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {course.capacity}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                              {course.enrolledStudents.length}/{course.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => setSelectedCourseForStudents(course)}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.primary} text-white`}
                                title="Ver estudiantes"
                              >
                                <Users className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingCourse(course)}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.secondary} ${theme.text}`}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteCourse(course.id)}
                                className={`inline-flex items-center p-1.5 rounded-lg ${theme.danger} text-white`}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;