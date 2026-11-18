import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StatusBadge from '../common/StatusBadge';
import StockSkeleton from '../stock/StockSkeleton';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statuses = ['pending', 'approved', 'completed', 'rejected', 'cancelled', 'expired'];

export default function AdminDonationRequests() {
  const [filters, setFilters] = useState({ status: '', bloodGroup: '' });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pages: 1, total: 0 });
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [requests, stockResponse] = await Promise.all([api.getAdminDonations({ ...filters, page }), api.getBloodStock()]);
      setResult(requests.data || { data: [], pages: 1, total: 0 });
      setStock(stockResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load donation requests.');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const act = async (request, action) => {
    const confirmText = { approve: 'Approve this donation request?', reject: 'Reject this donation request?', complete: 'Mark this donation as completed and add one available unit?' }[action];
    if (!window.confirm(confirmText)) return;
    try {
      await api.updateAdminDonation(request._id, action);
      toast.success(`Donation request ${({ approve: 'approved', reject: 'rejected', complete: 'completed' })[action]}.`);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update donation request.');
    }
  };

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  return <section className="premium-card mb-4">
    <h2 className="h5 fw-bold">Donor donation requests</h2>
    <p className="small text-muted">Pending and approved requests count as incoming units. Only completion adds available stock.</p>
    <div className="row g-2 mb-3"><div className="col-12 col-md-4"><label className="form-label small" htmlFor="admin-donation-status">Status</label><select id="admin-donation-status" className="form-select" value={filters.status} onChange={(event) => changeFilter('status', event.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="col-12 col-md-4"><label className="form-label small" htmlFor="admin-donation-group">Blood group</label><select id="admin-donation-group" className="form-select" value={filters.bloodGroup} onChange={(event) => changeFilter('bloodGroup', event.target.value)}><option value="">All blood groups</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></div></div>
    {error && <div className="alert alert-danger">{error}<button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div>}
    {loading ? <StockSkeleton count={4} type="table" /> : result.data.length === 0 ? <div className="empty-state">No donation requests yet.</div> : <>
      <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Donor</th><th>Group</th><th>Preferred date</th><th>Center</th><th>Status</th><th>Actions</th></tr></thead><tbody>{result.data.map((request) => <tr key={request._id}><td>{request.donor?.name || 'Donor'}</td><td><span className="blood-badge">{request.bloodGroup}</span></td><td>{new Date(request.preferredDate).toLocaleDateString()}</td><td>{request.center}</td><td><StatusBadge status={request.status} /></td><td><div className="d-flex flex-wrap gap-2">{request.status === 'pending' && <><button type="button" className="btn btn-sm btn-success" onClick={() => act(request, 'approve')}>Approve</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => act(request, 'reject')}>Reject</button></>}{request.status === 'approved' && <><button type="button" className="btn btn-sm btn-blood-primary" onClick={() => act(request, 'complete')}>Mark completed</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => act(request, 'reject')}>Reject</button></>}</div></td></tr>)}</tbody></table></div>
      <div className="d-flex justify-content-between align-items-center small"><span>{result.total} request(s)</span><div className="d-flex gap-2"><button type="button" className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="align-self-center">Page {page} of {Math.max(1, result.pages)}</span><button type="button" className="btn btn-sm btn-outline-secondary" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next</button></div></div>
    </>}
      <div className="row g-3 mt-3" aria-label="Current blood stock"><div className="col-12"><h3 className="h6 fw-bold mb-0">Blood stock</h3></div>{stock.map((item) => <div className="col-6 col-md-3" key={item.bloodGroup}><article className="premium-card h-100 p-3"><div className="d-flex justify-content-between align-items-center"><span className="blood-badge">{item.bloodGroup}</span><span className={`badge ${item.status === 'Critical' ? 'bg-danger' : item.status === 'Low' ? 'bg-warning text-dark' : 'bg-success'}`}>{item.status}</span></div><div className="mt-3"><strong>{item.availableUnits}</strong><span className="small text-muted ms-1">available</span></div><div><strong>{item.incomingUnits}</strong><span className="small text-muted ms-1">incoming</span></div></article></div>)}</div>
  </section>;
}
