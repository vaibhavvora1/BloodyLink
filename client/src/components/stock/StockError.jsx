import React from 'react';

export default function StockError({ message = 'Failed to load stock data. Please check connection.', onRetry }) {
  return (
    <div className="premium-card text-center py-5 border-danger">
      <div className="mb-3">
        <i className="bi bi-exclamation-triangle-fill text-danger display-4" aria-hidden="true"></i>
      </div>
      <h3 className="h5 fw-bold text-danger mb-2">Unable to Load Data</h3>
      <p className="text-muted small mb-3">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-blood-primary" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i> Retry
        </button>
      )}
    </div>
  );
}
