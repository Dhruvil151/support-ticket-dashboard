import { render, screen, fireEvent, act } from '@testing-library/react';
import { TicketFormModal } from '../../src/components/TicketFormModal.jsx';

describe('TicketFormModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form inputs and close button', () => {
    render(<TicketFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create ticket/i })).toBeInTheDocument();
  });

  it('should display real-time AI priority suggestion badge as user types in title/description', () => {
    render(<TicketFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);

    // Initially low priority
    expect(screen.getByTestId('ai-priority-badge')).toHaveTextContent(/low/i);

    // Type high priority words
    fireEvent.change(titleInput, { target: { value: 'Payment failed' } });
    fireEvent.change(descInput, { target: { value: 'Urgent system down' } });

    expect(screen.getByTestId('ai-priority-badge')).toHaveTextContent(/high/i);
  });

  it('should display validation error messages when submitting empty form', () => {
    render(<TicketFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /create ticket/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/description must be at least 5 characters/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should invoke onSubmit with ticket data when valid', async () => {
    render(<TicketFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Database Issue' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Query taking very slow response' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create ticket/i }));
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Database Issue',
      description: 'Query taking very slow response',
      priority: 'medium'
    });
  });
});
