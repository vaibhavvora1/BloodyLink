import React from 'react';

export default function StockEmpty({ message = 'No stock records found matching your filters.', onReset }) {
  return (
    <div className="premium-card text-center py-5">
      <div className="mb-3">
        <i className="bi bi-inbox text-muted display-4" aria-hidden="true"></i>
      </div>
      <h3 className="h5 fw-bold mb-2">No Records Available</h3>
      <p className="text-muted small mb-3">{message}</p>
      {onReset && (
        <button type="button" className="btn btn-sm btn-blood-secondary" onClick={onReset}>
          Reset Filters
        </button>
      )}
    </div>
  );
}
