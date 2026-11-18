import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminMenu from '../../components/admin/AdminMenu';
import StockSkeleton from '../../components/stock/StockSkeleton';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const emptyForm = { bloodGroup: '', units: '' };

export default function BloodStock() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '', bloodGroup: '', status: '' });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getStockList(filters);
      setItems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load blood stock.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const units = Number(form.units);
      if (editingId) await api.updateStock(editingId, { availableUnits: units });
      else await api.addStock({ bloodGroup: form.bloodGroup, units });
      toast.success(editingId ? 'Available stock updated.' : 'Available units added.');
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save blood stock.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({ bloodGroup: item.bloodGroup, units: String(item.availableUnits) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clear = async (item) => {
    if (!window.confirm(`Clear available ${item.bloodGroup} stock? Incoming units will remain pending.`)) return;
    try {
      await api.deleteStock(item._id);
      toast.success('Available stock cleared.');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not clear available stock.');
    }
  };

  return <div className="admin-layout"><AdminMenu /><main className="admin-main">
    <div className="mb-4"><span className="text-uppercase small fw-bold text-danger">Admin workspace</span><h1 className="h3 fw-bold mb-1">Blood bank inventory</h1><p className="text-muted small mb-0">Incoming donations stay separate until an administrator marks them completed.</p></div>
    <form className="premium-card mb-4" onSubmit={submit}>
      <h2 className="h5 fw-bold">{editingId ? `Set ${form.bloodGroup} available units` : 'Add available units'}</h2>
      <div className="row g-3 align-items-end">
        {!editingId && <div className="col-12 col-sm-5"><label className="form-label small fw-semibold" htmlFor="stock-blood-group">Blood group</label><select id="stock-blood-group" className="form-select" required value={form.bloodGroup} onChange={(event) => setForm({ ...form, bloodGroup: event.target.value })}><option value="">Select blood group</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></div>}
        <div className="col-12 col-sm-5"><label className="form-label small fw-semibold" htmlFor="stock-units">{editingId ? 'Available units' : 'Units to add'}</label><input id="stock-units" className="form-control" type="number" min={editingId ? 0 : 1} step="1" required value={form.units} onChange={(event) => setForm({ ...form, units: event.target.value })} /></div>
        <div className="col-12 col-sm-2 d-flex gap-2"><button className="btn btn-blood-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save' : 'Add'}</button>{editingId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}</div>
      </div>
    </form>
    <section className="premium-card">
      <div className="row g-2 mb-3"><div className="col-12 col-md-5"><label className="visually-hidden" htmlFor="stock-search">Search blood group</label><input id="stock-search" className="form-control" placeholder="Search blood group" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></div><div className="col-6 col-md-3"><select aria-label="Filter by blood group" className="form-select" value={filters.bloodGroup} onChange={(event) => setFilters({ ...filters, bloodGroup: event.target.value })}><option value="">All blood groups</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></div><div className="col-6 col-md-4"><select aria-label="Filter by stock level" className="form-select" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">All stock levels</option><option>Critical</option><option>Low</option><option>Available</option></select></div></div>
      {loading ? <StockSkeleton count={5} type="table" /> : error ? <div className="alert alert-danger">{error}<button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Retry</button></div> : items.length === 0 ? <div className="empty-state">No blood stock records yet.</div> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Group</th><th>Available</th><th>Incoming</th><th>Level</th><th>Updated</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item._id}><td><span className="blood-badge">{item.bloodGroup}</span></td><td className="fw-bold">{item.availableUnits}</td><td>{item.incomingUnits}</td><td><span className={`badge ${item.status === 'Critical' ? 'bg-danger' : item.status === 'Low' ? 'bg-warning text-dark' : 'bg-success'}`}>{item.status}</span></td><td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'}</td><td><div className="d-flex gap-2"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => edit(item)}>Edit</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => clear(item)}>Clear</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </main></div>;
}
