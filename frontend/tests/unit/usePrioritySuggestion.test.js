import { renderHook } from '@testing-library/react';
import { usePrioritySuggestion } from '../../src/hooks/usePrioritySuggestion.js';

describe('usePrioritySuggestion Hook', () => {
  it('should initialize with "low" default priority for empty text', () => {
    const { result } = renderHook(() => usePrioritySuggestion('', ''));
    expect(result.current.suggestedPriority).toBe('low');
  });

  it('should dynamically update suggestedPriority to "high" when urgent keywords are typed', () => {
    const { result, rerender } = renderHook(
      ({ title, desc }) => usePrioritySuggestion(title, desc),
      { initialProps: { title: 'General query', desc: 'All good' } }
    );

    expect(result.current.suggestedPriority).toBe('low');

    rerender({ title: 'Payment failed during checkout', desc: 'Urgent help needed' });
    expect(result.current.suggestedPriority).toBe('high');
  });

  it('should dynamically update suggestedPriority to "medium" when medium keywords are typed', () => {
    const { result, rerender } = renderHook(
      ({ title, desc }) => usePrioritySuggestion(title, desc),
      { initialProps: { title: '', desc: '' } }
    );

    rerender({ title: 'Dashboard rendering error', desc: 'Very slow loading' });
    expect(result.current.suggestedPriority).toBe('medium');
  });
});
