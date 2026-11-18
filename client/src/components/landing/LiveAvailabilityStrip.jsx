import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BloodGroupCard from '../stock/BloodGroupCard';
import StockSkeleton from '../stock/StockSkeleton';

export default function LiveAvailabilityStrip() {
  const [availability, setAvailability] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; api.getPublicStockAvailability().then((result) => { if (active) setAvailability(result.data || []); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return <section className="py-5" style={{ backgroundColor: 'var(--color-bg-alt)' }}><div className="container app-container">
    <div className="d-flex flex-wrap justify-content-between align-items-end mb-4"><div><span className="text-danger fw-semibold small text-uppercase tracking-wide">Blood bank stock</span><h2 className="fw-bold mb-1">Blood availability</h2><p className="text-muted small mb-0">Current units recorded by administrators</p></div><Link to="/availability" className="btn btn-sm btn-outline-danger">Search stock <i className="bi bi-arrow-right ms-1" /></Link></div>
    {loading ? <StockSkeleton count={4} type="card" /> : error ? <div className="empty-state">Blood availability could not be loaded.</div> : availability.length ? <div className="row g-3">{availability.map((item) => <div key={item.bloodGroup} className="col-6 col-md-3"><BloodGroupCard bloodGroup={item.bloodGroup} units={item.availableUnits ?? item.totalUnits} status={item.status} isPublic /></div>)}</div> : <div className="empty-state">No blood stock records yet.</div>}
  </div></section>;
}
