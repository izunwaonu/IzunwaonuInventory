/**
 * Formats a date into a relative time string (e.g. "2 hours ago", "3 days ago")
 * @param date - Date to format (Date object or timestamp)
 * @returns Formatted relative time string
 */
export function timeAgo(date: Date | string | number): string {
  const now = new Date();
  const past = date instanceof Date ? date : new Date(date);
  
  // Get time difference in seconds
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds} seconds ago`;
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'a minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? 'an hour ago' : `${diffInHours} hours ago`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
  }
  
  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? 'a week ago' : `${diffInWeeks} weeks ago`;
  }
  
  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'a month ago' : `${diffInMonths} months ago`;
  }
  
  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? 'a year ago' : `${diffInYears} years ago`;
}