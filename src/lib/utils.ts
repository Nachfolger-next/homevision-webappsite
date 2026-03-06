import { type ClassValue, clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge'; // Not using Tailwind, so simple clsx is enough

export function cn(...inputs: ClassValue[]) {
  // return twMerge(clsx(inputs));
  return clsx(inputs);
}
