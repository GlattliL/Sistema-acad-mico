import React, { useState } from 'react';
import { Student, Theme } from '../types';
import { toast } from 'react-hot-toast';
import { UserPlus, Save } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialValues?: Student;
  isEdit?: boolean;
  theme: Theme;
}

export function StudentForm({ onSubmit, initialValues, isEdit, theme }: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    age: initialValues?.age || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.age) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const age = Number(formData.age);
    if (age < 18) {
      setError('El estudiante debe ser mayor de 18 años');
      return;
    }

    setError(null);
    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: age,
      enrolledCourses: initialValues?.enrolledCourses || [],
    });

    if (!isEdit) {
      setFormData({ firstName: '', lastName: '', age: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${theme.text}`}>Nombre</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          className={`mt-1 block w-full rounded-md ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${theme.text}`}>Apellido</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          className={`mt-1 block w-full rounded-md ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${theme.text}`}>Edad</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          className={`mt-1 block w-full rounded-md ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${theme.primary} ${theme.primaryHover}`}
      >
        {isEdit ? <Save className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
        {isEdit ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
      </button>
    </form>
  );
}