import React from 'react';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  theme: Theme;
}

export function Modal({ isOpen, onClose, title, children, theme }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className={`relative w-full max-w-md transform rounded-lg ${theme.card} p-6 shadow-xl transition-all`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${theme.text}`}>{title}</h3>
            <button
              onClick={onClose}
              className={`rounded-full p-1 ${theme.secondary} ${theme.secondaryHover}`}
            >
              <X className={`h-5 w-5 ${theme.text}`} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}