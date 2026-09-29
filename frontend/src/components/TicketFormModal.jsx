import React, { useState } from 'react';
import { usePrioritySuggestion } from '../hooks/usePrioritySuggestion.js';
import { PriorityBadge } from './PriorityBadge.jsx';
import { Sparkles, X } from 'lucide-react';

export function TicketFormModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { suggestedPriority } = usePrioritySuggestion(title, description);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim() || title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters long';
    }
    if (!description.trim() || description.trim().length < 5) {
      errs.description = 'Description must be at least 5 characters long';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrs = validate();
    if (Object.keys(validationErrs).length > 0) {
      setErrors(validationErrs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority: suggestedPriority
      });
      // Reset form on success
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Support Ticket</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {apiError && (
          <div className="field-error" style={{ marginBottom: '1rem' }}>
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ticket-title">Title *</label>
            <input
              id="ticket-title"
              type="text"
              className="form-control"
              placeholder="e.g. Payment failed during checkout"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
              }}
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="ticket-description">Description *</label>
            <textarea
              id="ticket-description"
              rows={4}
              className="form-control"
              placeholder="Describe the problem, steps to reproduce, or issue details..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
          </div>

          <div className="ai-suggestion-box">
            <div className="ai-suggestion-info">
              <Sparkles size={16} color="#818cf8" />
              <span>Suggested priority:</span>
            </div>
            <div data-testid="ai-priority-badge">
              <PriorityBadge priority={suggestedPriority} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="filter-tab"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
