import { Theme } from '../types';

export const theme: Theme = {
  primary: 'bg-purple-600',
  primaryHover: 'hover:bg-purple-700',
  secondary: 'bg-gray-200',
  secondaryHover: 'hover:bg-gray-300',
  danger: 'bg-red-600',
  dangerHover: 'hover:bg-red-700',
  success: 'bg-emerald-600',
  successHover: 'hover:bg-emerald-700',
  background: 'bg-gray-50',
  foreground: 'bg-white',
  card: 'bg-white',
  text: 'text-gray-900',
  textSecondary: 'text-gray-500',
  border: 'border-gray-200'
};

export function useTheme() {
  return theme;
}