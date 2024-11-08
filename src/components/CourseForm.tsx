import React, { useState } from 'react';
import { Course, Theme } from '../types';
import { toast } from 'react-hot-toast';
import { BookPlus, Save } from 'lucide-react';

interface CourseFormProps {
  onSubmit: (course: Omit<Course, 'id' | 'enrolledStudents'>) => void;
  initialValues?: Course;
  isEdit?: boolean;
  theme: Theme;
}

export function CourseForm({ onSubmit, initialValues, isEdit, theme }: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    capacity: initialValues?.capacity || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    onSubmit({
      name: formData.name,
      capacity: Number(formData.capacity),
    });

    if (!isEdit) {
      setFormData({ name: '', capacity: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${theme.text}`}>Nombre de la Materia</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`mt-1 block w-full rounded-md ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium ${theme.text}`}>Capacidad</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
          className={`mt-1 block w-full rounded-md ${theme.card} ${theme.text} ${theme.border} border focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      <button
        type="submit"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${theme.primary} ${theme.primaryHover}`}
      >
        {isEdit ? <Save className="mr-2 h-4 w-4" /> : <BookPlus className="mr-2 h-4 w-4" />}
        {isEdit ? 'Actualizar Materia' : 'Agregar Materia'}
      </button>
    </form>
  );
}