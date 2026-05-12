import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names with clsx for conditional classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
