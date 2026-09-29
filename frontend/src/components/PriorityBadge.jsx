import React from 'react';

export function PriorityBadge({ priority = 'low' }) {
  const normalized = priority.toLowerCase();
  const className = `badge badge-${normalized}`;

  return (
    <span className={className}>
      <span style={{ fontSize: '0.6rem' }}>●</span> {normalized}
    </span>
  );
}
