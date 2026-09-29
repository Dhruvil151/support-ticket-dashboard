/**
 * AI-inspired Keyword Priority Suggestion Service
 * Pure business logic rule engine that analyzes ticket text and returns suggested priority.
 */

export function suggestPriority(title = '', description = '') {
  const text = `${title || ''} ${description || ''}`.toLowerCase();

  const highPriorityWords = ['urgent', 'down', 'security', 'payment failed'];
  const mediumPriorityWords = ['slow', 'issue', 'error'];

  if (highPriorityWords.some(word => text.includes(word))) {
    return 'high';
  }

  if (mediumPriorityWords.some(word => text.includes(word))) {
    return 'medium';
  }

  return 'low';
}
