import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../src/components/StatusBadge.jsx';

describe('StatusBadge Component', () => {
  it('should render correct text and badge style for "open" status', () => {
    render(<StatusBadge status="open" />);
    const badge = screen.getByText(/open/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('status-open');
  });

  it('should render correct style for "in-progress" status', () => {
    render(<StatusBadge status="in-progress" />);
    const badge = screen.getByText(/in-progress/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('status-in-progress');
  });

  it('should render correct style for "resolved" status', () => {
    render(<StatusBadge status="resolved" />);
    const badge = screen.getByText(/resolved/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('status-resolved');
  });
});
