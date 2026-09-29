import { render, screen, fireEvent } from '@testing-library/react';
import { TicketDashboard } from '../../src/components/TicketDashboard.jsx';

// Mock hook output for test scenarios
vi.mock('../../src/hooks/useTickets.js', () => ({
  useTickets: vi.fn(() => ({
    tickets: [
      { id: '1', title: 'Ticket One', description: 'Desc 1', priority: 'high', status: 'open', createdAt: new Date().toISOString() },
      { id: '2', title: 'Ticket Two', description: 'Desc 2', priority: 'low', status: 'resolved', createdAt: new Date().toISOString() }
    ],
    meta: { total: 2, open: 1, inProgress: 0, resolved: 1 },
    loading: false,
    error: null,
    statusFilter: 'all',
    setStatusFilter: vi.fn(),
    createTicket: vi.fn(),
    updateTicketStatus: vi.fn(),
    refetch: vi.fn()
  }))
}));

describe('TicketDashboard Main View', () => {
  it('should render header, status filter tabs, and ticket cards', () => {
    render(<TicketDashboard />);

    expect(screen.getByText(/support ticket dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/all tickets/i)).toBeInTheDocument();
    expect(screen.getByText('Ticket One')).toBeInTheDocument();
    expect(screen.getByText('Ticket Two')).toBeInTheDocument();
  });

  it('should open new ticket modal when clicking "+ New Ticket" button', () => {
    render(<TicketDashboard />);

    const newTicketBtn = screen.getByRole('button', { name: /new ticket/i });
    fireEvent.click(newTicketBtn);

    expect(screen.getByText(/create support ticket/i)).toBeInTheDocument();
  });
});
