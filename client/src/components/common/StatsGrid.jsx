import React from 'react';
import StatCard from './StatCard';

export default function StatsGrid({ stats = [], loading = false, emptyText = 'No statistics available.' }) {
  if (loading && (!Array.isArray(stats) || stats.length === 0)) {
    return (
      <section className="stats-grid" aria-label="Loading dashboard statistics" aria-busy="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="stat-card stat-card-loading" key={index}>
            <div className="stat-card-skeleton-icon" />
            <div className="stat-card-skeleton-label" />
            <div className="stat-card-skeleton-value" />
          </div>
        ))}
      </section>
    );
  }
  if (!loading && (!Array.isArray(stats) || stats.length === 0)) {
    return <div className="stats-empty" role="status">{emptyText}</div>;
  }

  return (
    <section className="stats-grid" aria-label="Dashboard statistics">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </section>
  );
}
