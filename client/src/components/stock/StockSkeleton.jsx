import React from 'react';

export default function StockSkeleton({ count = 4, type = 'card' }) {
  if (type === 'table') {
    return (
      <div className="table-responsive p-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="placeholder-glow py-3 border-bottom d-flex gap-3">
            <span className="placeholder col-2 rounded"></span>
            <span className="placeholder col-3 rounded"></span>
            <span className="placeholder col-2 rounded"></span>
            <span className="placeholder col-2 rounded"></span>
            <span className="placeholder col-2 rounded"></span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="col-12 col-sm-6 col-md-3">
          <div className="premium-card p-3 placeholder-glow">
            <div className="d-flex justify-content-between mb-3">
              <span className="placeholder col-4 rounded-pill py-2"></span>
              <span className="placeholder col-3 rounded-pill py-2"></span>
            </div>
            <span className="placeholder col-12 rounded py-2 mb-2"></span>
            <span className="placeholder col-8 rounded"></span>
          </div>
        </div>
      ))}
    </div>
  );
}
