import React from 'react';
import { getStatusTheme } from '../../utils/stockStatus';

export default function StockStatusBadge({ status }) {
  const theme = getStatusTheme(status);

  return (
    <span
      className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-semibold small"
      style={{
        backgroundColor: theme.bgVar,
        color: theme.colorVar,
        border: `1px solid ${theme.colorVar}33`
      }}
      role="status"
    >
      <i className={`bi ${theme.icon} me-1`} aria-hidden="true"></i>
      <span>{status}</span>
    </span>
  );
}
