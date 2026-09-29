import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCard } from '../../src/components/TicketCard.jsx';

describe('TicketCard Component', () => {
  const mockTicket = {
    id: 't-101',
    title: 'Payment Gateway Timeout',
    description: 'Users reporting payment failed error during checkout.',
    priority: 'high',
    status: 'open',
    createdAt: new Date().toISOString()
  };

  const mockOnStatusChange = vi.fn();

  it('should render ticket details cleanly', () => {
    render(<TicketCard ticket={mockTicket} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByText('Payment Gateway Timeout')).toBeInTheDocument();
    expect(screen.getByText(/payment failed error/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/open/i)).toBeInTheDocument();
  });

  it('should trigger onStatusChange prop when status selector changes', () => {
    render(<TicketCard ticket={mockTicket} onStatusChange={mockOnStatusChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'resolved' } });

    expect(mockOnStatusChange).toHaveBeenCalledWith('t-101', 'resolved');
  });
});
