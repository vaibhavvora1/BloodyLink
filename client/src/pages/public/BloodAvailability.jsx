import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockError from '../../components/stock/StockError';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const pageSize = 4;

export default function BloodAvailability() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getPublicStock({ bloodGroup, page, limit: pageSize });
      setResult(response.data || { data: [], pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load blood availability.');
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, page]);

  useEffect(() => { load(); }, [load]);

  const changeGroup = (value) => {
    setBloodGroup(value);
    setPage(1);
  };

  return <div className="container app-container py-5">
    <div className="text-center mb-4"><span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-2">Blood availability</span><h1 className="display-6 fw-bold mb-2">Search available blood</h1><p className="text-muted">Only completed donations count as available stock. Incoming donations are not shown here.</p></div>
    <section className="premium-card mb-4"><label className="form-label small fw-semibold" htmlFor="availability-group">Blood group</label><div className="row g-2 align-items-end"><div className="col-12 col-sm-6 col-md-4"><select id="availability-group" className="form-select" value={bloodGroup} onChange={(event) => changeGroup(event.target.value)}><option value="">All groups</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></div>{bloodGroup && <div className="col-auto"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => changeGroup('')}>Clear filter</button></div>}</div></section>
    {loading ? <StockSkeleton count={4} /> : error ? <StockError message={error} onRetry={load} /> : result.data.length === 0 ? <div className="empty-state"><i className="bi bi-search fs-3 d-block mb-2" />No available stock matches this blood group yet.</div> : <>
      <p className="small text-muted">{result.total} blood group(s) with available stock</p><div className="row g-3">{result.data.map((item) => <div className="col-12 col-md-6 col-xl-3" key={item.bloodGroup}><article className="premium-card h-100"><div className="d-flex justify-content-between align-items-center mb-3"><span className="blood-badge fs-6">{item.bloodGroup}</span><span className={`badge ${item.status === 'Critical' ? 'bg-danger' : item.status === 'Low' ? 'bg-warning text-dark' : 'bg-success'}`}>{item.status}</span></div><div className="display-6 fw-bold">{item.availableUnits}<span className="fs-6 fw-normal text-muted ms-2">available units</span></div><p className="small text-muted mt-3 mb-0">Updated {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'recently'}</p></article></div>)}</div>
      <div className="d-flex justify-content-between align-items-center mt-4"><button type="button" className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="small text-muted">Page {page} of {Math.max(result.pages, 1)}</span><button type="button" className="btn btn-outline-secondary" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next</button></div>
    </>}
  </div>;
}
