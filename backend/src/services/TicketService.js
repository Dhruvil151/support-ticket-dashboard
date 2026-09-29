import { suggestPriority } from '../domain/services/PrioritySuggestionService.js';

export class TicketService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  getAllTickets(statusFilter) {
    return this.ticketRepository.findAll(statusFilter);
  }

  getTicketCounts() {
    return this.ticketRepository.getCounts();
  }

  getTicketById(id) {
    const ticket = this.ticketRepository.findById(id);
    if (!ticket) {
      const error = new Error(`Ticket with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  }

  createTicket(data) {
    const priority = data.priority || suggestPriority(data.title, data.description);

    return this.ticketRepository.save({
      title: data.title,
      description: data.description,
      priority,
      status: 'open'
    });
  }

  updateTicketStatus(id, newStatus) {
    const updated = this.ticketRepository.updateStatus(id, newStatus);
    if (!updated) {
      const error = new Error(`Ticket with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }
}
