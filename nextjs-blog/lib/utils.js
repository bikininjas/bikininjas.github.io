// Utility function to convert a string to a URL-friendly slug
export function slugify(string) {
  // Limit input length to prevent DoS
  const MAX_LENGTH = 200;
  const input = string.slice(0, MAX_LENGTH);
  
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^a-z0-9-]+/g, '')  // Remove all non-word chars (using non-capturing group)
    .replace(/-+/g, '-')          // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

// Utility function to format a date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
