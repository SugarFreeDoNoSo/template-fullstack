import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string, fmt = 'PP') {
  return format(typeof date === 'string' ? new Date(date) : date, fmt);
}

export function relativeTime(date: Date | string) {
  return formatDistanceToNow(typeof date === 'string' ? new Date(date) : date, {
    addSuffix: true,
  });
}
