import React from 'react';

export default function StatCard({ label, value = 0, icon = 'bi-bar-chart', tone = 'red', trend, loading = false }) {
  return (
    <section className={`stat-card stat-card-${tone}`} aria-label={label} aria-busy={loading}>
      <div className="stat-card-heading">
        <span className="stat-card-icon" aria-hidden="true"><i className={`bi ${icon}`} /></span>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
      <div className="stat-card-label" title={label}>{label}</div>
      <strong className="stat-card-value">{loading ? '—' : value}</strong>
    </section>
  );
}
