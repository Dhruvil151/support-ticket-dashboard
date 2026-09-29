import React from 'react';

export function StatusBadge({ status = 'open' }) {
  const normalized = status.toLowerCase();
  const className = `status-badge status-${normalized}`;

  return (
    <span className={className}>
      {normalized}
    </span>
  );
}
