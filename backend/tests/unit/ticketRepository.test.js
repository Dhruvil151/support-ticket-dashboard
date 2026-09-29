import { InMemoryTicketRepository } from '../../src/repositories/InMemoryTicketRepository.js';

describe('InMemoryTicketRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new InMemoryTicketRepository();
  });

  it('should initialize with pre-seeded tickets', () => {
    const tickets = repository.findAll();
    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets[0]).toHaveProperty('id');
    expect(tickets[0]).toHaveProperty('title');
    expect(tickets[0]).toHaveProperty('status');
  });

  it('should filter tickets by status', () => {
    const openTickets = repository.findAll('open');
    expect(openTickets.every(t => t.status === 'open')).toBe(true);

    const resolvedTickets = repository.findAll('resolved');
    expect(resolvedTickets.every(t => t.status === 'resolved')).toBe(true);
  });

  it('should find a ticket by ID', () => {
    const all = repository.findAll();
    const existingId = all[0].id;
    const found = repository.findById(existingId);
    expect(found).toEqual(all[0]);
  });

  it('should return null when finding non-existent ID', () => {
    const found = repository.findById('non-existent-id-12345');
    expect(found).toBeNull();
  });

  it('should save a new ticket entity and assign ID and createdAt timestamp if not provided', () => {
    const newTicketData = {
      title: 'New Integration Ticket',
      description: 'Testing repository save logic',
      priority: 'high',
      status: 'open'
    };
    const savedTicket = repository.save(newTicketData);
    expect(savedTicket.id).toBeDefined();
    expect(savedTicket.createdAt).toBeDefined();
    expect(savedTicket.title).toBe(newTicketData.title);

    const retrieved = repository.findById(savedTicket.id);
    expect(retrieved).toEqual(savedTicket);
  });

  it('should update ticket status successfully', () => {
    const all = repository.findAll();
    const targetTicket = all[0];
    const newStatus = targetTicket.status === 'open' ? 'in-progress' : 'open';

    const updated = repository.updateStatus(targetTicket.id, newStatus);
    expect(updated.status).toBe(newStatus);
    expect(repository.findById(targetTicket.id).status).toBe(newStatus);
  });

  it('should return null when updating status of non-existent ticket', () => {
    const result = repository.updateStatus('fake-id', 'resolved');
    expect(result).toBeNull();
  });
});
