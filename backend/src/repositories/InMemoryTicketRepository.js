import { v4 as uuidv4 } from 'uuid';
import { createTicketEntity } from '../domain/entities/Ticket.js';

export class InMemoryTicketRepository {
  constructor() {
    this.tickets = [];
    this._seedInitialData();
  }

  _seedInitialData() {
    const seedTickets = [
      {
        id: 't-101',
        title: 'Payment Gateway Timeout',
        description: 'Users reporting payment failed error during checkout step 2.',
        priority: 'high',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      },
      {
        id: 't-102',
        title: 'Dashboard Metrics Loading Slow',
        description: 'Analytics chart takes over 8 seconds to render for admin users.',
        priority: 'medium',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
      },
      {
        id: 't-103',
        title: 'Update Company Logo in Email Header',
        description: 'Marketing team requested updating email footer and header branding.',
        priority: 'low',
        status: 'resolved',
        createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
      },
      {
        id: 't-104',
        title: 'Security Vulnerability Patch',
        description: 'Urgent patch required for JWT authentication middleware dependency.',
        priority: 'high',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ];

    this.tickets = seedTickets.map(t => createTicketEntity(t));
  }

  findAll(statusFilter) {
    if (statusFilter) {
      return this.tickets.filter(ticket => ticket.status === statusFilter);
    }
    return [...this.tickets];
  }

  getCounts() {
    return {
      total: this.tickets.length,
      open: this.tickets.filter(t => t.status === 'open').length,
      inProgress: this.tickets.filter(t => t.status === 'in-progress').length,
      resolved: this.tickets.filter(t => t.status === 'resolved').length
    };
  }

  findById(id) {
    const ticket = this.tickets.find(t => t.id === id);
    return ticket ? { ...ticket } : null;
  }

  save(ticketData) {
    const newTicket = createTicketEntity({
      id: ticketData.id || `t-${uuidv4().substring(0, 8)}`,
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: ticketData.status || 'open',
      createdAt: ticketData.createdAt || new Date().toISOString()
    });

    this.tickets.unshift(newTicket);
    return { ...newTicket };
  }

  updateStatus(id, newStatus) {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      return null;
    }

    this.tickets[index].status = newStatus;
    return { ...this.tickets[index] };
  }
}
