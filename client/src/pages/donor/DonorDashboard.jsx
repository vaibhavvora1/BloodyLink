import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import DonationRequestPanel from '../../components/donor/DonationRequestPanel';

const idOf = (item) => item._id || item.id;
export default function DonorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]); const [offers, setOffers] = useState([]); const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ bloodGroup: user?.bloodGroup || '', city: user?.city || '', availableFrom: '' });
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [search, setSearch] = useState(''); const [sort, setSort] = useState('newest'); const [page, setPage] = useState(1); const pageSize = 5;
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true); setError('');
    try { const [matchRes, offerRes, notificationRes, profileRes] = await Promise.all([api.getDonorMatches(), api.getDonorOffers(), api.getDonorNotifications(), api.getDonorProfile()]); setMatches(matchRes.data || []); setOffers(offerRes.data || []); setNotifications(notificationRes.data || []); setProfile(profileRes.data); }
    catch (err) { setError(err.response?.data?.message || 'Unable to load your donor dashboard.'); }
    finally { if (!silent) setLoading(false); }
  }, []);
  useEffect(() => { load(); const refresh = () => load({ silent: true }); const timer = setInterval(refresh, 30000); window.addEventListener('focus', refresh); return () => { clearInterval(timer); window.removeEventListener('focus', refresh); }; }, [load]);
  const history = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...matches].filter((match) => [match.bloodGroup, match.city, match.request?.hospital, match.patient?.name, match.status].filter(Boolean).join(' ').toLowerCase().includes(term)).sort((a, b) => {
      const first = new Date(a.appointment?.date || a.createdAt).getTime(); const second = new Date(b.appointment?.date || b.createdAt).getTime();
      return sort === 'oldest' ? first - second : second - first;
    });
  }, [matches, search, sort]);
  const pageRows = history.slice((page - 1) * pageSize, page * pageSize);
  const createOffer = async (event) => {
    event.preventDefault();
    try { setSaving(true); await api.createDonationOffer(form); toast.success('Donation offer published.'); setForm({ ...form, availableFrom: '' }); await load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Could not publish offer.'); }
    finally { setSaving(false); }
  };
  const eligibleDate = profile?.donationEligibility?.eligibleAfter ? new Date(profile.donationEligibility.eligibleAfter) : null;
  const eligible = profile?.donationEligibility?.eligible !== false;
  const intervalDays = profile?.donationEligibility?.minimumIntervalDays;
  if (loading) return <div className="container app-container py-5"><StockSkeleton count={4} /></div>;
  return <div className="container app-container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-2">Donor dashboard</span><h1 className="h3 fw-bold mb-1">Donation history and offers</h1><p className="text-muted small mb-0">Your private information is shared with a patient only after admin approval.</p></div><Link to="/donor/requests" className="btn btn-blood-secondary">Browse open requests</Link></div>
    {error && <div className="alert alert-danger">{error}<button className="btn btn-sm btn-outline-danger ms-3" onClick={load}>Retry</button></div>}
    <DonationRequestPanel bloodGroup={profile?.bloodGroup || user?.bloodGroup} />
    <div className="row g-4 mb-5"><div className="col-12 col-lg-5"><form onSubmit={createOffer} className="premium-card form-animate h-100"><h2 className="h5 fw-bold">Post a donation offer</h2><p className="text-muted small">Patients can request an offer that matches their blood request.</p><BloodGroupSelect label="Blood group" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} required /><div className="mb-3"><label className="form-label small fw-semibold">City</label><input className="form-control" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" required /></div><div className="mb-3"><label className="form-label small fw-semibold">Available from</label><input className="form-control" type="date" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} min={new Date().toISOString().slice(0, 10)} required /></div><button className="btn btn-blood-primary w-100" type="submit" disabled={saving}>{saving ? 'Publishing…' : 'Publish offer'}</button></form></div>
      <div className="col-12 col-lg-7"><div className="premium-card h-100"><h2 className="h5 fw-bold">Eligibility</h2><p className="mb-1">{eligible ? intervalDays ? `Based on your last completed donation, the ${intervalDays}-day interval is met.` : 'Your donation interval is met.' : `Next eligible date: ${eligibleDate?.toLocaleDateString()}`}</p><p className="small text-muted mb-4">Eligibility guidance is checked by the server and does not replace clinical screening.</p><h3 className="h6 fw-bold">Your offers</h3>{offers.length ? offers.map((offer) => <div className="d-flex justify-content-between border-top py-2 small" key={idOf(offer)}><span><strong>{offer.bloodGroup}</strong> · {offer.city}</span><span><span className={`badge ${offer.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{offer.isActive ? 'Available' : 'Inactive'}</span> · {new Date(offer.availableFrom).toLocaleDateString()}</span></div>) : <p className="text-muted small mb-0">No offers yet.</p>}</div></div>
    </div>
    <section className="mb-5"><div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3"><div><h2 className="h5 fw-bold mb-1">Donation history</h2><p className="small text-muted mb-0">Approved patient details appear after approval.</p></div><div className="d-flex gap-2"><input className="form-control" aria-label="Search donation history" placeholder="Search history" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /><select className="form-select" aria-label="Sort donation history" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div></div>
      {history.length ? <><div className="table-responsive premium-card p-3"><table className="table align-middle mb-0"><thead><tr><th>Date</th><th>Hospital / place</th><th>Blood group</th><th>Units</th><th>Patient</th><th>Status</th></tr></thead><tbody>{pageRows.map((match) => <tr key={idOf(match)}><td>{new Date(match.appointment?.date || match.createdAt).toLocaleDateString()}</td><td>{match.appointment?.place || match.request?.hospital || match.city}</td><td>{match.bloodGroup}</td><td>{match.request?.units || '—'}</td><td>{match.patient?.name || 'Private until approval'}</td><td><StatusBadge status={match.status} /><div className="small text-muted mt-1">{(match.statusHistory || []).map((step) => step.status).join(' → ')}</div></td></tr>)}</tbody></table></div><div className="d-flex justify-content-between align-items-center mt-3 small"><span>{history.length} record(s)</span><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="align-self-center">Page {page} of {Math.max(1, Math.ceil(history.length / pageSize))}</span><button className="btn btn-sm btn-outline-secondary" disabled={page >= Math.ceil(history.length / pageSize)} onClick={() => setPage(page + 1)}>Next</button></div></div></> : <div className="empty-state">No donation history yet.</div>}
    </section>
    <section><h2 className="h5 fw-bold mb-3">Inbox</h2>{notifications.length ? notifications.map((note) => <article className="notification-row" key={idOf(note)}><div className="d-flex justify-content-between gap-3"><strong>{note.title}</strong><small className="text-muted">{new Date(note.createdAt).toLocaleString()}</small></div><p className="mb-0 mt-2">{note.message}</p></article>) : <div className="empty-state">No notifications yet.</div>}</section>
  </div>;
}
