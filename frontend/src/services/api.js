const API_BASE = '/api';

export async function fetchTickets(statusFilter) {
  const url = statusFilter && statusFilter !== 'all'
    ? `${API_BASE}/tickets?status=${encodeURIComponent(statusFilter)}`
    : `${API_BASE}/tickets`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tickets');
  }

  return {
    tickets: data.data,
    meta: data.meta || { total: data.data.length, open: 0, inProgress: 0, resolved: 0 }
  };
}

export async function createTicket(ticketPayload) {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketPayload)
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : (data.message || 'Failed to create ticket');
    const err = new Error(errorMsg);
    err.errors = data.errors || [errorMsg];
    throw err;
  }

  return data.data;
}

export async function updateTicketStatus(id, newStatus) {
  const response = await fetch(`${API_BASE}/tickets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update ticket status');
  }

  return data.data;
}
