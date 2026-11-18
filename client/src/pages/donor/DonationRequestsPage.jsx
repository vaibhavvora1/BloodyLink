import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DonationConfirmModal from '../../components/donor/DonationConfirmModal';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';
import StatusBadge from '../../components/common/StatusBadge';

const idOf = (item) => item._id || item.id;
export default function DonationRequestsPage() {
  const [requests, setRequests] = useState([]); const [profile, setProfile] = useState(null); const [selected, setSelected] = useState(null); const [loading, setLoading] = useState(true); const [confirming, setConfirming] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const [response, profileResponse] = await Promise.all([api.getDonorRequests(), api.getDonorProfile()]); setRequests(response.data || []); setProfile(profileResponse.data); }
    catch (err) { setError(err.response?.data?.message || 'Unable to load open requests.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const confirm = async () => {
    if (!selected) return;
    try { setConfirming(true); await api.acceptBloodRequest(idOf(selected)); setSuccess(true); toast.success('Your interest was sent for admin approval.'); await load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Could not accept this request.'); }
    finally { setConfirming(false); }
  };
  const closeModal = () => { setSelected(null); setSuccess(false); };
  return <div className="container app-container py-5">
    <div className="mb-4"><span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-2">Donor matching</span><h1 className="h3 fw-bold mb-1">Open patient requests</h1><p className="text-muted small mb-0">Patient names and contact details stay private until admin approval.</p></div>
    {!loading && !error && !profile?.isAvailable && <div className="alert alert-warning">Your availability is paused. <Link to="/donor/profile">Update your profile availability</Link> before accepting a request.</div>}
    {loading ? <StockSkeleton count={4} type="table" /> : error ? <StockError message={error} onRetry={load} /> : requests.length === 0 ? <StockEmpty message="No requests yet." /> : <div className="row g-3">{requests.map((request) => <div className="col-12 col-md-6" key={idOf(request)}><article className="premium-card h-100 d-flex flex-column"><div className="d-flex justify-content-between gap-2 mb-3"><span className="blood-badge">{request.bloodGroup}</span><StatusBadge status={request.status} /></div><h2 className="h5 fw-bold">{request.hospital}</h2><p className="small text-muted"><i className="bi bi-geo-alt me-1" />{request.city} · {request.units} unit(s)</p><p className="small">Urgency: <strong>{request.urgency}</strong></p><p className="small text-muted">Required by {new Date(request.requiredDate).toLocaleDateString()}</p><button type="button" className="btn btn-blood-primary mt-auto" disabled={!profile?.isAvailable} onClick={() => { setSelected(request); setSuccess(false); }}>I want to donate</button></article></div>)}</div>}
    <DonationConfirmModal show={!!selected} request={selected} onHide={closeModal} onConfirm={confirm} loading={confirming} success={success} />
  </div>;
}
