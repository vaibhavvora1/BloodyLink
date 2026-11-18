import React from 'react';

export default function Skeleton({ type = 'card', count = 1, className = '' }) {
  const rows = Array.from({ length: Math.max(1, count) }, (_, index) => index);
  if (type === 'table-row') return <>{rows.map((row) => <div className={`skeleton-row ${className}`} key={row}><span /><span /><span /><span /><span /></div>)}</>;
  if (type === 'profile') return <div className={`skeleton-profile ${className}`}><span className="skeleton-block skeleton-avatar" /><div className="flex-grow-1"><span className="skeleton-block w-50 mb-3" /><span className="skeleton-block w-100 mb-2" /><span className="skeleton-block w-75" /></div></div>;
  if (type === 'list') return <div className={className}>{rows.map((row) => <div className="skeleton-list-item" key={row}><span className="skeleton-block skeleton-avatar" /><div className="flex-grow-1"><span className="skeleton-block w-50 mb-2" /><span className="skeleton-block w-75" /></div></div>)}</div>;
  return <div className={`row g-3 ${className}`}>{rows.map((row) => <div className="col-12 col-sm-6 col-lg-4" key={row}><div className="premium-card skeleton-card"><span className="skeleton-block w-25 mb-3" /><span className="skeleton-block w-75 mb-2" /><span className="skeleton-block w-100 mb-2" /><span className="skeleton-block w-50" /></div></div>)}</div>;
}
