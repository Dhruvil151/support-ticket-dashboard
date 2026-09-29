/**
 * Ticket Domain Entity
 * Defines constraints and status constants for Support Tickets.
 */

export const TICKET_PRIORITIES = ['low', 'medium', 'high'];
export const TICKET_STATUSES = ['open', 'in-progress', 'resolved'];

export function createTicketEntity({ id, title, description, priority = 'low', status = 'open', createdAt }) {
  return {
    id,
    title,
    description,
    priority,
    status,
    createdAt: createdAt || new Date().toISOString()
  };
}
