import React from 'react';

const tone = (status = '') => {
  const value = status.toLowerCase();
  if (['approved', 'scheduled', 'completed'].includes(value)) return 'success';
  if (['pending', 'pending admin approval', 'accepted by donor'].includes(value)) return 'warning';
  if (['rejected', 'cancelled', 'expired'].includes(value)) return 'secondary';
  return 'primary';
};

export default function StatusBadge({ status = 'Requested' }) {
  return <span className={`badge rounded-pill status-pill status-${tone(status)}`}>{status}</span>;
}
