import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

export default function DonorSchedulingPage() {
  const [matches, setMatches] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.getDonorMatches().then((response) => setMatches(response.data || [])).catch((err) => setError(err.response?.data?.message || 'Unable to load scheduled donations.')).finally(() => setLoading(false)); }, []);
  const scheduled = matches.filter((match) => match.status === 'Scheduled' || match.status === 'Completed');
  return <div className="container app-container py-5"><h1 className="h3 fw-bold">Donation schedule</h1><p className="text-muted">Appointments are created by an administrator after a match is approved.</p>{loading ? <StockSkeleton count={3} type="table" /> : error ? <div className="alert alert-danger">{error}</div> : scheduled.length ? <div className="row g-3">{scheduled.map((match) => <article className="col-12 col-lg-6" key={match._id}><div className="premium-card"><div className="d-flex justify-content-between"><strong>{match.appointment?.hospital || match.request?.hospital}</strong><StatusBadge status={match.status} /></div><p className="small text-muted mb-2">{match.appointment?.place} · {match.appointment?.address}</p><p className="mb-1">{match.appointment?.date ? new Date(match.appointment.date).toLocaleDateString() : ''} · {match.appointment?.time}</p><p className="small mb-0">Contact: {match.appointment?.contactPerson}</p></div></article>)}</div> : <div className="empty-state">No scheduled donations yet.</div>}</div>;
}
