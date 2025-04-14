// Utility function to convert a string to a URL-friendly slug
export function slugify(string) {
  if (!string) return '';
  return string
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Utility function to format a date
export function formatDate(dateString) {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return 'Invalid Date';
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function removeAccents(string) {
  if (!string) return '';
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
