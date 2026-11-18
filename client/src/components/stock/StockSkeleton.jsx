import React from 'react';
import Skeleton from '../common/Skeleton';

export default function StockSkeleton({ count = 4, type = 'card' }) {
  return type === 'table'
    ? <div className="table-responsive"><Skeleton type="table-row" count={count} /></div>
    : <Skeleton type="card" count={count} />;
}
