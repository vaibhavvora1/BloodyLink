import React from 'react';
import StockStatusBadge from './StockStatusBadge';
import { getStatusTheme } from '../../utils/stockStatus';

export default function BloodGroupCard({
  bloodGroup,
  units,
  status,
  isPublic = false,
  onRequest
}) {
  const theme = getStatusTheme(status);
  const fillPercentage = Math.min(100, Math.round(((units || (status === 'Available' ? 30 : status === 'Low' ? 15 : 5)) / 40) * 100));

  return (
    <div className="premium-card h-100 d-flex flex-column justify-content-between p-3">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="blood-badge fs-5">{bloodGroup}</span>
          <StockStatusBadge status={status} />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <span className="text-muted small">
              {isPublic ? 'Availability Level' : 'In Stock'}
            </span>
            <span className="fw-bold" style={{ color: theme.colorVar }}>
              {isPublic ? status : `${units} Units`}
            </span>
          </div>
          <div className="progress" style={{ height: '8px', backgroundColor: 'var(--color-bg-alt)' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${fillPercentage}%`,
                backgroundColor: theme.colorVar,
                transition: 'width 0.4s ease'
              }}
              aria-valuenow={fillPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${bloodGroup} stock level: ${fillPercentage}%`}
            />
          </div>
        </div>
      </div>

      {isPublic && onRequest && (
        <button
          type="button"
          className="btn btn-sm btn-blood-secondary w-100 mt-2"
          onClick={() => onRequest(bloodGroup)}
        >
          Request {bloodGroup}
        </button>
      )}
    </div>
  );
}
