// Utility function to convert a string to a URL-friendly slug
export function slugify(text) {
  if (!text) return '';
  
  return text
    .normalize('NFD')           // Normalize to decomposed form for handling accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')        // Remove leading hyphens
    .replace(/-+$/, '');       // Remove trailing hyphens
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
