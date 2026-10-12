import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  if (phone.startsWith('0')) {
    return '+254' + phone.slice(1);
  }
  if (phone.startsWith('254') && !phone.startsWith('+')) {
    return '+' + phone;
  }
  return phone;
}

export function validateKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^\+254\d{9}$/.test(cleaned) || /^0\d{9}$/.test(cleaned);
}
