/**
 * Sanitizes a chat title from user message text.
 * - Trims whitespace
 * - Removes excessive punctuation
 * - Caps at 40 characters with ellipsis
 * - Falls back to "Untitled Chat"
 */
const sanitizeTitle = (text) => {
  if (!text || typeof text !== 'string') return 'Untitled Chat';

  let title = text.trim();
  // Remove excessive punctuation (runs of 3+ punctuation chars)
  title = title.replace(/[^\w\s]{3,}/g, '');
  // Remove leading/trailing punctuation
  title = title.replace(/^[^\w\s]+|[^\w\s]+$/g, '').trim();

  if (!title) return 'Untitled Chat';

  if (title.length > 40) {
    title = title.substring(0, 37) + '...';
  }

  return title;
};

export default sanitizeTitle;
