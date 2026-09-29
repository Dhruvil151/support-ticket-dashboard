import { suggestPriority } from '../../src/domain/services/PrioritySuggestionService.js';

describe('PrioritySuggestionService - suggestPriority (AI Keyword Engine)', () => {
  it('should return "high" when title contains a high-priority keyword', () => {
    const priority = suggestPriority('Urgent server error', 'User cannot log in');
    expect(priority).toBe('high');
  });

  it('should return "high" when description contains a high-priority keyword', () => {
    const priority = suggestPriority('Database alert', 'Payment failed during checkout processing');
    expect(priority).toBe('high');
  });

  it('should return "high" for security and down keywords case-insensitively', () => {
    expect(suggestPriority('SECURITY Vulnerability Reported', 'Details in report')).toBe('high');
    expect(suggestPriority('System DOWN', 'Entire site is inaccessible')).toBe('high');
  });

  it('should return "medium" when text contains medium-priority keywords ("slow", "issue", "error")', () => {
    expect(suggestPriority('Dashboard is slow', 'Page loading takes 10 seconds')).toBe('medium');
    expect(suggestPriority('UI Issue', 'Button alignment off on mobile')).toBe('medium');
    expect(suggestPriority('Unhandled Error', 'Console error on click')).toBe('medium');
  });

  it('should return "low" when no high or medium priority keywords exist', () => {
    const priority = suggestPriority('Update user avatar', 'User wants to upload a custom profile picture');
    expect(priority).toBe('low');
  });

  it('should prioritize "high" over "medium" when both categories are present', () => {
    const priority = suggestPriority('Slow response and payment failed', 'System issue resulting in down service');
    expect(priority).toBe('high');
  });

  it('should handle empty strings, null, or undefined gracefully by returning "low"', () => {
    expect(suggestPriority('', '')).toBe('low');
    expect(suggestPriority(null, undefined)).toBe('low');
  });
});
