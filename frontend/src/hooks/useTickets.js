import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api.js';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.fetchTickets(statusFilter);
      setTickets(res.tickets);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      setError(err.message || 'Error fetching tickets');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreateTicket = async (ticketData) => {
    try {
      const created = await api.createTicket(ticketData);
      loadTickets(); // Refresh list & meta counts
      return created;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updated = await api.updateTicketStatus(id, newStatus);
      loadTickets(); // Refresh list & meta counts
      return updated;
    } catch (err) {
      loadTickets();
      throw err;
    }
  };

  return {
    tickets,
    meta,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    createTicket: handleCreateTicket,
    updateTicketStatus: handleUpdateStatus,
    refetch: loadTickets
  };
}
