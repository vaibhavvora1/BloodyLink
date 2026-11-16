export const STOCK_THRESHOLDS = {
  CRITICAL: 10,
  LOW: 25
};

export const STOCK_STATUS = {
  CRITICAL: 'Critical',
  LOW: 'Low',
  AVAILABLE: 'Available'
};

export function getStockStatus(units) {
  if (units < STOCK_THRESHOLDS.CRITICAL) {
    return STOCK_STATUS.CRITICAL;
  }
  if (units < STOCK_THRESHOLDS.LOW) {
    return STOCK_STATUS.LOW;
  }
  return STOCK_STATUS.AVAILABLE;
}

export function getStatusTheme(status) {
  if (status === STOCK_STATUS.CRITICAL) {
    return {
      variant: 'danger',
      colorVar: 'var(--color-danger)',
      bgVar: 'var(--color-primary-light)',
      icon: 'bi-exclamation-octagon-fill'
    };
  }
  if (status === STOCK_STATUS.LOW) {
    return {
      variant: 'warning',
      colorVar: 'var(--color-warning)',
      bgVar: 'var(--color-accent-light)',
      icon: 'bi-exclamation-triangle-fill'
    };
  }
  return {
    variant: 'success',
    colorVar: 'var(--color-success)',
    bgVar: '#E8F5E9',
    icon: 'bi-check-circle-fill'
  };
}

export function isExpiringSoon(expiryDateStr, daysThreshold = 7) {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysThreshold;
}
