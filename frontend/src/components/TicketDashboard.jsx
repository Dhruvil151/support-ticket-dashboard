import React, { useState } from 'react';
import { useTickets } from '../hooks/useTickets.js';
import { TicketCard } from './TicketCard.jsx';
import { TicketFormModal } from './TicketFormModal.jsx';
import { Ticket, Plus, Filter, AlertCircle, RefreshCw, Layers, CheckCircle2, Clock } from 'lucide-react';

export function TicketDashboard() {
  const {
    tickets,
    meta,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    createTicket,
    updateTicketStatus,
    refetch
  } = useTickets();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCount = meta?.total ?? tickets.length;
  const openCount = meta?.open ?? tickets.filter(t => t.status === 'open').length;
  const inProgressCount = meta?.inProgress ?? tickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = meta?.resolved ?? tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <header className="header-banner">
        <div className="header-title-group">
          <h1>
            <Ticket size={28} color="#6366f1" />
            Support Ticket Dashboard
          </h1>
          <p>Support queue with automatic keyword-based priority suggestions</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          New Ticket
        </button>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value">{openCount}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <RefreshCw size={22} />
          </div>
          <div>
            <div className="stat-value">{inProgressCount}</div>
            <div className="stat-label">In-Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{resolvedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Controls */}
      <section className="controls-bar">
        <div className="filter-tabs" role="tablist">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Tickets ({totalCount})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'open' ? 'active' : ''}`}
            onClick={() => setStatusFilter('open')}
          >
            Open ({openCount})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in-progress')}
          >
            In-Progress ({inProgressCount})
          </button>
          <button
            className={`filter-tab ${statusFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <button className="filter-tab" onClick={refetch} title="Refresh list">
          <RefreshCw size={14} style={{ marginRight: '4px' }} /> Refresh
        </button>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <div>
            <strong>Error connecting to server:</strong> {error}
          </div>
        </div>
      )}

      {/* Loading Skeleton / Ticket List */}
      {loading ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-secondary)' }}>Loading tickets from backend API...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <Filter size={36} color="#64748b" style={{ marginBottom: '0.75rem' }} />
          <h3>No tickets found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {statusFilter !== 'all'
              ? `No tickets currently match status filter "${statusFilter}".`
              : 'Click "+ New Ticket" to create your first ticket.'}
          </p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={updateTicketStatus}
            />
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <TicketFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTicket}
      />
    </div>
  );
}
