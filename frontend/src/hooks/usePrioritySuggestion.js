import { useMemo } from 'react';

export function suggestPriorityClient(title = '', description = '') {
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

export function usePrioritySuggestion(title, description) {
  const suggestedPriority = useMemo(() => {
    return suggestPriorityClient(title, description);
  }, [title, description]);

  return { suggestedPriority };
}
