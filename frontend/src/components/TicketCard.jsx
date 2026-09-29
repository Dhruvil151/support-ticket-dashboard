import React from 'react';
import { PriorityBadge } from './PriorityBadge.jsx';

export function TicketCard({ ticket, onStatusChange }) {
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="ticket-card" data-testid={`ticket-card-${ticket.id}`}>
      <div>
        <div className="ticket-card-header">
          <h3 className="ticket-title">{ticket.title}</h3>
          <PriorityBadge priority={ticket.priority} />
        </div>
        <p className="ticket-description">{ticket.description}</p>
      </div>

      <div className="ticket-card-footer">
        <div>
          <span>Created: </span>
          <strong>{formatDate(ticket.createdAt)}</strong>
        </div>

        <div>
          <select
            className="status-select"
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
            aria-label={`Change status for ticket ${ticket.title}`}
          >
            <option value="open">Open</option>
            <option value="in-progress">In-Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
}
