import React from 'react';

export default function StockSummary({ summary }) {
  if (!summary) return null;

  const stats = [
    {
      title: 'Total Stock',
      value: `${summary.totalUnits} Units`,
      icon: 'bi-droplet-half',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)'
    },
    {
      title: 'Critical Groups',
      value: summary.criticalCount,
      icon: 'bi-exclamation-octagon-fill',
      color: 'var(--color-danger)',
      bg: '#ffebee'
    },
    {
      title: 'Low Groups',
      value: summary.lowCount,
      icon: 'bi-exclamation-triangle-fill',
      color: 'var(--color-warning)',
      bg: 'var(--color-accent-light)'
    },
    {
      title: 'Expiring in 7 Days',
      value: summary.expiringCount,
      icon: 'bi-clock-history',
      color: 'var(--color-text-muted)',
      bg: 'var(--color-bg-alt)'
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((s, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-3">
          <div className="premium-card p-3 d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-3 fs-4"
              style={{ backgroundColor: s.bg, color: s.color, minWidth: '52px', minHeight: '52px' }}
              aria-hidden="true"
            >
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div>
              <small className="text-muted d-block">{s.title}</small>
              <span className="fs-5 fw-bold text-dark">{s.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
