import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockError from '../../components/stock/StockError';
import StatusBadge from '../../components/common/StatusBadge';

const idOf = (item) => item._id || item.id;
export default function PatientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]); const [offers, setOffers] = useState([]); const [matches, setMatches] = useState([]); const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [sendingId, setSendingId] = useState('');
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true); setError('');
    try {
      const [requestRes, offerRes, matchRes, notificationRes] = await Promise.all([api.getPatientRequests(), api.getDonationOffers({ bloodGroup: user?.bloodGroup || '' }), api.getPatientMatches(), api.getPatientNotifications()]);
      setRequests(requestRes.data || []); setOffers(offerRes.data || []); setMatches(matchRes.data || []); setNotifications(notificationRes.data || []);
    } catch (err) { setError(err.response?.data?.message || 'Unable to load your patient dashboard.'); }
    finally { if (!silent) setLoading(false); }
  }, [user?.bloodGroup]);
  useEffect(() => { load(); const refresh = () => load({ silent: true }); const timer = setInterval(refresh, 30000); window.addEventListener('focus', refresh); return () => { clearInterval(timer); window.removeEventListener('focus', refresh); }; }, [load]);
  const requestOffer = async (offer) => {
    try { setSendingId(idOf(offer)); await api.requestDonationOffer(idOf(offer)); toast.success('Request sent for admin approval.'); await load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Could not request this donor.'); }
    finally { setSendingId(''); }
  };

  return <div className="container app-container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-2">Patient dashboard</span><h1 className="h3 fw-bold mb-1">Your requests and matches</h1><p className="text-muted small mb-0">Donor contact details appear only after an admin approves a match.</p></div><Link to="/patient/request" className="btn btn-blood-primary"><i className="bi bi-plus-lg me-1" />Create blood request</Link></div>
    {loading ? <StockSkeleton count={3} /> : error ? <StockError message={error} onRetry={load} /> : <>
      <section className="mb-5"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 fw-bold mb-0">Your blood requests</h2><span className="text-muted small">{requests.length} total</span></div>
        {requests.length ? <div className="row g-3">{requests.map((request) => <div className="col-12 col-lg-6" key={idOf(request)}><article className="premium-card h-100"><div className="d-flex justify-content-between gap-2 mb-3"><span className="blood-badge">{request.bloodGroup}</span><StatusBadge status={request.status} /></div><h3 className="h6 fw-bold">{request.hospital}</h3><p className="text-muted small mb-3">{request.city} · {request.units} unit(s) · {request.urgency}</p><div className="small d-flex flex-wrap justify-content-between gap-2 border-top pt-3"><span>Required: {new Date(request.requiredDate).toLocaleDateString()}</span><span>Contact: {request.contactPhone}</span></div></article></div>)}</div> : <div className="empty-state">No requests yet. <Link to="/patient/request">Create your first request</Link>.</div>}
      </section>

      <section className="mb-5"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 fw-bold mb-0">Available donation offers</h2></div>
        {offers.length ? <div className="row g-3">{offers.map((offer) => <div className="col-12 col-md-6 col-xl-4" key={idOf(offer)}><article className="premium-card h-100"><div className="d-flex justify-content-between mb-3"><span className="blood-badge">{offer.bloodGroup}</span><span className="badge bg-success-subtle text-success">Available</span></div><h3 className="h6 fw-bold">Available donor</h3><p className="small text-muted"><i className="bi bi-geo-alt me-1" />{offer.city}</p><p className="small text-muted">Available from {new Date(offer.availableFrom).toLocaleDateString()}</p><button className="btn btn-outline-danger w-100" disabled={sendingId === idOf(offer) || !requests.some((item) => item.status === 'Requested' && item.bloodGroup === offer.bloodGroup)} onClick={() => requestOffer(offer)}>{sendingId === idOf(offer) ? 'Sending…' : 'Request this donor'}</button></article></div>)}</div> : <div className="empty-state">No available donor offers yet.</div>}
      </section>

      <section className="mb-5"><h2 className="h5 fw-bold mb-3">Matches</h2>{matches.length ? <div className="table-responsive premium-card p-3"><table className="table align-middle mb-0"><thead><tr><th>Blood group</th><th>City</th><th>Status</th><th>Donor</th><th>Schedule</th></tr></thead><tbody>{matches.map((match) => <tr key={idOf(match)}><td>{match.bloodGroup}</td><td>{match.city}</td><td><StatusBadge status={match.status} /><div className="small text-muted mt-1">{(match.statusHistory || []).map((step) => step.status).join(' → ')}</div></td><td>{match.donor?.name || 'Private until approval'}{match.donor?.phone && <div className="small text-muted">{match.donor.phone}</div>}</td><td>{match.appointment ? `${new Date(match.appointment.date).toLocaleDateString()} · ${match.appointment.time} · ${match.appointment.hospital}` : 'Awaiting admin scheduling'}</td></tr>)}</tbody></table></div> : <div className="empty-state">No matches yet.</div>}</section>

      <section><h2 className="h5 fw-bold mb-3">Inbox</h2>{notifications.length ? notifications.map((note) => <article key={idOf(note)} className="notification-row"><div className="d-flex justify-content-between gap-3"><strong>{note.title}</strong><small className="text-muted">{new Date(note.createdAt).toLocaleString()}</small></div><p className="mb-0 mt-2">{note.message}</p></article>) : <div className="empty-state">No notifications yet.</div>}</section>
    </>}
  </div>;
}
