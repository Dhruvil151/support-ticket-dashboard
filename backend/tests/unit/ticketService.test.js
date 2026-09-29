import { TicketService } from '../../src/services/TicketService.js';
import { InMemoryTicketRepository } from '../../src/repositories/InMemoryTicketRepository.js';

describe('TicketService (Use Cases)', () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = new InMemoryTicketRepository();
    service = new TicketService(repository);
  });

  it('should list all tickets when no status filter is provided', () => {
    const tickets = service.getAllTickets();
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBe(repository.findAll().length);
  });

  it('should list tickets filtered by status', () => {
    const openTickets = service.getAllTickets('open');
    expect(openTickets.every(t => t.status === 'open')).toBe(true);
  });

  it('should create a ticket with auto-suggested priority if priority is omitted', () => {
    const created = service.createTicket({
      title: 'Payment failed during checkout',
      description: 'System down when user clicks pay'
    });

    expect(created.id).toBeDefined();
    expect(created.priority).toBe('high'); // Auto-suggested by AI engine
    expect(created.status).toBe('open'); // Default status
  });

  it('should respect explicitly provided priority if user chooses to override auto-suggestion', () => {
    const created = service.createTicket({
      title: 'Payment failed',
      description: 'User wants low priority for testing',
      priority: 'low'
    });

    expect(created.priority).toBe('low');
  });

  it('should update status of existing ticket', () => {
    const all = service.getAllTickets();
    const target = all[0];
    const updated = service.updateTicketStatus(target.id, 'resolved');

    expect(updated.id).toBe(target.id);
    expect(updated.status).toBe('resolved');
  });

  it('should throw an error with 404 code when updating non-existent ticket ID', () => {
    expect(() => {
      service.updateTicketStatus('invalid-id-xyz', 'resolved');
    }).toThrow('Ticket with ID invalid-id-xyz not found');
  });
});
