import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '../../src/components/PriorityBadge.jsx';

describe('PriorityBadge Component', () => {
  it('should render "High Priority" tag with correct class for high priority', () => {
    render(<PriorityBadge priority="high" />);
    const badge = screen.getByText(/high/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('badge-high');
  });

  it('should render "Medium Priority" tag for medium priority', () => {
    render(<PriorityBadge priority="medium" />);
    const badge = screen.getByText(/medium/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('badge-medium');
  });

  it('should render "Low Priority" tag for low priority', () => {
    render(<PriorityBadge priority="low" />);
    const badge = screen.getByText(/low/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('badge-low');
  });
});
