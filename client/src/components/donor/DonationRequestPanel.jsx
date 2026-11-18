import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StockSkeleton from '../stock/StockSkeleton';
import StatusBadge from '../common/StatusBadge';
import DonationRequestSuccessModal from './DonationRequestSuccessModal';

const today = new Date();
today.setUTCDate(today.getUTCDate() + 1);
const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export default function DonationRequestPanel({ bloodGroup = '' }) {
  const [form, setForm] = useState({ preferredDate: '', center: '' });
  const [requests, setRequests] = useState({ data: [], page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successRequest, setSuccessRequest] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getMyDonationRequests(page);
      setRequests(response.data || { data: [], page, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your donation requests.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
    const refresh = () => load();
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.createDonationRequest(form, crypto.randomUUID());
      setSuccessRequest(response.data);
      setForm({ preferredDate: '', center: '' });
      setPage(1);
      toast.success('Donation request submitted for review.');
      if (page !== 1) setPage(1);
      else await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit your donation request.');
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (request) => {
    if (!window.confirm('Cancel this donation request?')) return;
    try {
      await api.cancelDonationRequest(request._id);
      toast.success('Donation request cancelled.');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel this request.');
    }
  };

  return <section className="mb-5" aria-labelledby="donation-request-heading">
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <form onSubmit={submit} className="premium-card form-animate h-100">
          <h2 id="donation-request-heading" className="h5 fw-bold">Request to donate</h2>
          <p className="small text-muted">Your blood group comes from your verified donor profile. A request adds one incoming unit while it awaits review.</p>
          <div className="mb-3"><span className="form-label small fw-semibold d-block">Blood group</span><span className="blood-badge">{bloodGroup || 'Complete your profile'}</span></div>
          <div className="mb-3"><label className="form-label small fw-semibold" htmlFor="donation-preferred-date">Preferred date</label><input id="donation-preferred-date" className="form-control" type="date" min={minimumDate} required value={form.preferredDate} onChange={(event) => setForm({ ...form, preferredDate: event.target.value })} /></div>
          <div className="mb-3"><label className="form-label small fw-semibold" htmlFor="donation-center">Donation center</label><input id="donation-center" className="form-control" type="text" maxLength="150" required value={form.center} onChange={(event) => setForm({ ...form, center: event.target.value })} placeholder="Enter a donation center" /></div>
          <button className="btn btn-blood-primary w-100" type="submit" disabled={saving || !bloodGroup}>{saving ? 'Submitting…' : 'Submit donation request'}</button>
        </form>
      </div>
      <div className="col-12 col-lg-7">
        <div className="premium-card h-100">
          <h2 className="h5 fw-bold">My donation requests</h2>
          {error && <div className="alert alert-danger">{error}<button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div>}
          {loading ? <StockSkeleton count={3} type="table" /> : requests.data.length === 0 ? <div className="empty-state">No donation requests yet.</div> : <>
            <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Date</th><th>Blood group</th><th>Center</th><th>Status</th><th /></tr></thead><tbody>{requests.data.map((request) => <tr key={request._id}><td>{new Date(request.preferredDate).toLocaleDateString()}</td><td><span className="blood-badge">{request.bloodGroup}</span></td><td>{request.center}</td><td><StatusBadge status={request.status} /></td><td>{['pending', 'approved'].includes(request.status) && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => cancel(request)}>Cancel</button>}</td></tr>)}</tbody></table></div>
            <div className="d-flex justify-content-between align-items-center small"><span>{requests.total} request(s)</span><div className="d-flex gap-2"><button type="button" className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="align-self-center">Page {page} of {Math.max(1, requests.pages)}</span><button type="button" className="btn btn-sm btn-outline-secondary" disabled={page >= requests.pages} onClick={() => setPage(page + 1)}>Next</button></div></div>
          </>}
        </div>
      </div>
    </div>
    <DonationRequestSuccessModal request={successRequest} onHide={() => setSuccessRequest(null)} />
  </section>;
}
