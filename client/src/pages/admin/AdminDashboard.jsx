import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import AdminDonationRequests from '../../components/admin/AdminDonationRequests';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsGrid from '../../components/common/StatsGrid';

const adminNavItems = [
  { label: 'Dashboard', icon: 'bi-speedometer2', to: '/admin/dashboard?section=dashboard', active: (location) => location.pathname === '/admin/dashboard' && (new URLSearchParams(location.search).get('section') || 'dashboard') === 'dashboard' },
  { label: 'Requests & Matches', icon: 'bi-diagram-3', to: '/admin/dashboard?section=requests', active: (location) => new URLSearchParams(location.search).get('section') === 'requests' },
  { label: 'Donors', icon: 'bi-heart-pulse', to: '/admin/dashboard?section=donors', active: (location) => new URLSearchParams(location.search).get('section') === 'donors' },
  { label: 'Patients', icon: 'bi-person-vcard', to: '/admin/dashboard?section=patients', active: (location) => new URLSearchParams(location.search).get('section') === 'patients' },
  { label: 'Blood Bank', icon: 'bi-droplet-half', to: '/admin/blood-stock', active: (location) => location.pathname === '/admin/blood-stock' },
  { label: 'Hospitals', icon: 'bi-hospital', to: '/admin/dashboard?section=hospitals', active: (location) => new URLSearchParams(location.search).get('section') === 'hospitals' },
  { label: 'Messages', icon: 'bi-chat-left-text', to: '/admin/dashboard?section=messages', active: (location) => new URLSearchParams(location.search).get('section') === 'messages' },
  { label: 'Settings', icon: 'bi-gear', to: '/admin/dashboard?section=settings', active: (location) => new URLSearchParams(location.search).get('section') === 'settings' }
];

const emptyHospital = { name: '', contactPerson: '', phone: '', email: '', city: '', address: '' };
const messageTemplate = 'Your blood donation match has been approved and scheduled. Please review the details below.';

function Empty({ children = 'No records yet.' }) { return <div className="empty-state p-4 text-center text-muted">{children}</div>; }
function FilterBar({ filters, setFilters }) {
  return <div className="row g-2 mb-3">
    <div className="col-12 col-md-4"><select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{['Requested', 'Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></div>
    <div className="col-12 col-md-3"><select className="form-select" value={filters.bloodGroup} onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}><option value="">All blood groups</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select></div>
    <div className="col-12 col-md-5"><input className="form-control" placeholder="Filter by city" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} /></div>
  </div>;
}

export default function AdminDashboard() {
  const [params] = useSearchParams();
  const section = params.get('section') || 'dashboard';
  const [filters, setFilters] = useState({ status: '', bloodGroup: '', city: '' }); const [offerStatus, setOfferStatus] = useState('');
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scheduleMatch, setScheduleMatch] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', place: '', hospital: '', address: '', contactPerson: '', instructions: '', messageTemplate });
  const [hospitalForm, setHospitalForm] = useState(emptyHospital);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [contactSelections, setContactSelections] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      if (section === 'dashboard') {
        const response = await api.getAdminDashboard(); setStats(response.data);
      } else if (section === 'requests') {
        const [r, o, m, h] = await Promise.all([api.getAdminRequests(filters), api.getAdminOffers({ ...filters, status: offerStatus }), api.getAdminMatches(filters), api.getAdminHospitals()]);
        setRequests(r.data || []); setOffers(o.data || []); setMatches(m.data || []); setHospitals(h.data || []);
      } else if (section === 'donors') {
        const response = await api.getAdminDonors(); setDonors(response.data || []);
      } else if (section === 'patients') {
        const response = await api.getAdminPatients(); setPatients(response.data || []);
      } else if (section === 'hospitals') {
        const response = await api.getAdminHospitals(); setHospitals(response.data || []);
      } else if (section === 'messages') {
        const response = await api.getAdminMessages(); setMessages(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data.');
    } finally { setLoading(false); }
  }, [section, filters, offerStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  const act = async (fn, success) => {
    try { await fn(); toast.success(success); await loadData(); }
    catch (err) { toast.error(err.response?.data?.message || 'The action could not be completed.'); }
  };

  const openSchedule = (match) => {
    const hospitalRecord = hospitals.find((item) => item.name?.toLowerCase() === match.request?.hospital?.toLowerCase());
    setScheduleMatch(match);
    setScheduleForm((prev) => ({ ...prev, hospital: match.request?.hospital || '', place: match.request?.hospital || '', address: hospitalRecord?.address || '', contactPerson: hospitalRecord?.contactPerson || '' }));
  };

  const approve = async (match) => {
    try { await api.updateMatchStatus(match._id, 'Approved'); openSchedule(match); toast.success('Match approved. Add schedule details to notify both people.'); await loadData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Unable to approve this match.'); }
  };
  const submitSchedule = async (event) => {
    event.preventDefault();
    try { await api.scheduleMatch(scheduleMatch._id, scheduleForm); toast.success('Scheduled. Both people have been notified.'); setScheduleMatch(null); await loadData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Unable to schedule this match.'); }
  };
  const saveHospital = async (event) => {
    event.preventDefault();
    await act(() => editingHospitalId ? api.updateHospital(editingHospitalId, hospitalForm) : api.createHospital(hospitalForm), editingHospitalId ? 'Hospital updated.' : 'Hospital added.');
    setHospitalForm(emptyHospital); setEditingHospitalId(null);
  };
  const title = ({ dashboard: 'Dashboard', requests: 'Requests & Matches', donors: 'Donors', patients: 'Patients', hospitals: 'Hospitals', messages: 'Messages', settings: 'Settings' })[section] || 'Dashboard';

  return <DashboardLayout title={title} roleLabel="Admin workspace" navItems={adminNavItems} onRefresh={loadData} loading={loading}>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <StockSkeleton count={4} /> : <>
        {section === 'dashboard' && <>
          <StatsGrid stats={[
            { label: 'Total Donors', value: stats?.donors ?? 0, icon: 'bi-heart-pulse', tone: 'red' },
            { label: 'Total Patients', value: stats?.patients ?? 0, icon: 'bi-person-vcard', tone: 'gold' },
            { label: 'Pending Requests', value: stats?.pendingMatches ?? stats?.pendingRequests ?? 0, icon: 'bi-hourglass-split', tone: 'red' },
            { label: 'Donations This Month', value: stats?.donationsThisMonth ?? 0, icon: 'bi-droplet-half', tone: 'gold' }
          ]} />
          <div className="premium-card mt-4"><h2 className="h5">Workflow overview</h2><p className="text-muted mb-0">Review requests, approve donor-patient matches, maintain stock and hospital contacts, then schedule approved donations.</p></div>
        </>}

        {section === 'requests' && <>
          <AdminDonationRequests />
          <FilterBar filters={filters} setFilters={setFilters} />
          <section className="premium-card mb-4"><h2 className="h5 fw-bold">Blood requests</h2>{requests.length ? <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Group / units</th><th>Patient</th><th>Hospital / city</th><th>Required</th><th>Status</th><th>Contact hospital</th></tr></thead><tbody>{requests.map((request) => <tr key={request._id}><td><span className="blood-badge">{request.bloodGroup}</span><div className="small text-muted">{request.units} units</div></td><td>{request.patient?.name || 'Patient'}<div className="small text-muted">{request.patient?.phone}</div></td><td>{request.hospital}<div className="small text-muted">{request.city}</div></td><td>{new Date(request.requiredDate).toLocaleDateString()}</td><td><StatusBadge status={request.status} /></td><td><div className="d-flex gap-2"><select aria-label="Choose hospital" className="form-select form-select-sm" value={contactSelections[request._id] || ''} onChange={(e) => setContactSelections({ ...contactSelections, [request._id]: e.target.value })}><option value="">Choose hospital</option>{hospitals.map((hospital) => <option key={hospital._id} value={hospital._id}>{hospital.name}</option>)}</select><button className="btn btn-sm btn-outline-danger" disabled={!contactSelections[request._id]} onClick={() => act(() => api.contactHospital(request._id, contactSelections[request._id]), 'Hospital contact logged on the request.')}>Contact</button></div>{request.contactLogs?.length > 0 && <small className="text-success">{request.contactLogs.length} contact logged</small>}</td></tr>)}</tbody></table></div> : <Empty>No requests yet.</Empty>}</section>
          <section className="premium-card mb-4"><h2 className="h5 fw-bold">Donor-patient matches</h2>{matches.length ? <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Patient</th><th>Donor</th><th>Group / city</th><th>Status</th><th>Actions</th></tr></thead><tbody>{matches.map((match) => <tr key={match._id}><td>{match.patient?.name || 'Patient'}<div className="small text-muted">{match.patient?.phone}</div></td><td>{match.donor?.name || 'Donor'}<div className="small text-muted">{match.donor?.phone}</div></td><td>{match.bloodGroup}<div className="small text-muted">{match.city}</div></td><td><StatusBadge status={match.status} /></td><td className="d-flex flex-wrap gap-2">{match.status === 'Pending Admin Approval' && <><button className="btn btn-sm btn-success" onClick={() => approve(match)}>Approve</button><button className="btn btn-sm btn-outline-danger" onClick={() => act(() => api.updateMatchStatus(match._id, 'Rejected', 'Rejected by administrator'), 'Match rejected.')}>Reject</button></>}{match.status === 'Approved' && <button className="btn btn-sm btn-blood-primary" onClick={() => openSchedule(match)}>Schedule & notify</button>}{match.status === 'Scheduled' && <button className="btn btn-sm btn-outline-success" onClick={() => act(() => api.updateMatchStatus(match._id, 'Completed'), 'Match marked completed.')}>Mark completed</button>}</td></tr>)}</tbody></table></div> : <Empty>No matches yet.</Empty>}</section>
          <section className="premium-card"><div className="d-flex flex-wrap justify-content-between align-items-center gap-2"><h2 className="h5 fw-bold mb-0">Donation offers</h2><select aria-label="Filter donation offers by status" className="form-select form-select-sm dashboard-offer-filter" value={offerStatus} onChange={(e) => setOfferStatus(e.target.value)}><option value="">All offer statuses</option><option value="Available">Available</option><option value="Inactive">Inactive</option></select></div>{offers.length ? <div className="table-responsive mt-3"><table className="table align-middle"><thead><tr><th>Donor</th><th>Group</th><th>City</th><th>Availability</th><th>Status</th><th>Actions</th></tr></thead><tbody>{offers.map((offer) => <tr key={offer._id}><td>{offer.donor?.name || 'Donor'}<div className="small text-muted">{offer.donor?.phone}</div></td><td>{offer.bloodGroup}</td><td>{offer.city}</td><td>{new Date(offer.availableFrom).toLocaleDateString()}</td><td><span className={`badge ${offer.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{offer.isActive ? 'Available' : 'Inactive'}</span></td><td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => act(() => api.updateAdminOfferStatus(offer._id, !offer.isActive), 'Offer availability updated.')}>{offer.isActive ? 'Deactivate' : 'Activate'}</button><button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm('Delete this donation offer?') && act(() => api.deleteAdminOffer(offer._id), 'Offer deleted.')}>Delete</button></div></td></tr>)}</tbody></table></div> : <Empty>No offers yet.</Empty>}</section>
        </>}

        {section === 'donors' && <section className="premium-card"><h2 className="h5">Donor management</h2>{donors.length ? <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Name</th><th>Contact</th><th>Group</th><th>City</th><th>Availability / account</th><th /></tr></thead><tbody>{donors.map((donor) => { const blocked = donor.isBlocked === true || donor.isActive === false; return <tr key={donor._id}><td>{donor.name}</td><td>{donor.email}<br />{donor.phone}</td><td>{donor.bloodGroup}</td><td>{donor.city}</td><td>{blocked ? 'Blocked' : donor.isAvailable ? 'Available' : 'Unavailable'}</td><td className="d-flex gap-2"><button className={`btn btn-sm ${blocked ? 'btn-outline-success' : 'btn-outline-warning'}`} onClick={() => act(() => api.updateAdminDonorStatus(donor._id, { isActive: true, isBlocked: !blocked }), blocked ? 'Donor unblocked.' : 'Donor blocked.')}>{blocked ? 'Unblock' : 'Block'}</button><button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm('Delete this donor account? Active donation requests must be resolved first.') && act(() => api.deleteAdminDonor(donor._id), 'Donor account deleted.')}>Delete</button></td></tr>; })}</tbody></table></div> : <Empty>No donors yet.</Empty>}</section>}
        {section === 'patients' && <section className="premium-card"><h2 className="h5">Patient management</h2>{patients.length ? <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Name</th><th>Contact</th><th>Blood group</th><th>City</th><th>Hospital</th><th /></tr></thead><tbody>{patients.map((patient) => <tr key={patient._id}><td>{patient.name}</td><td>{patient.email}<br />{patient.phone}</td><td>{patient.bloodGroup}</td><td>{patient.city}</td><td>{patient.hospital}</td><td><button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm('Delete this patient account and its requests?') && act(() => api.deleteAdminPatient(patient._id), 'Patient account deleted.')}>Delete</button></td></tr>)}</tbody></table></div> : <Empty>No patients yet.</Empty>}</section>}

        {section === 'hospitals' && <div className="row g-4"><div className="col-12 col-xl-5"><form className="premium-card" onSubmit={saveHospital}><h2 className="h5">{editingHospitalId ? 'Update hospital' : 'Add hospital'}</h2>{[['name', 'Hospital name'], ['contactPerson', 'Contact person'], ['phone', 'Phone'], ['email', 'Email'], ['city', 'City'], ['address', 'Address']].map(([key, label]) => <div className="mb-3" key={key}><label className="form-label small fw-semibold">{label}</label><input className="form-control" required={key !== 'address'} type={key === 'email' ? 'email' : 'text'} value={hospitalForm[key]} onChange={(e) => setHospitalForm({ ...hospitalForm, [key]: e.target.value })} /></div>)}<div className="d-flex gap-2"><button className="btn btn-blood-primary" type="submit">{editingHospitalId ? 'Save hospital' : 'Add hospital'}</button>{editingHospitalId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingHospitalId(null); setHospitalForm(emptyHospital); }}>Cancel</button>}</div></form></div><div className="col-12 col-xl-7"><section className="premium-card"><h2 className="h5">Hospital directory</h2>{hospitals.length ? hospitals.map((hospital) => <div className="hospital-row" key={hospital._id}><div><strong>{hospital.name}</strong><div className="small text-muted">{hospital.contactPerson} · {hospital.city}<br />{hospital.phone} · {hospital.email}</div></div><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingHospitalId(hospital._id); setHospitalForm(Object.fromEntries(Object.keys(emptyHospital).map((key) => [key, hospital[key] || '']))); }}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => act(() => api.deleteHospital(hospital._id), 'Hospital removed.')}>Delete</button></div></div>) : <Empty>No hospitals in the directory.</Empty>}</section></div></div>}
        {section === 'messages' && <section className="premium-card"><h2 className="h5">Scheduled donation messages</h2>{messages.length ? messages.map((item) => <article className="notification-row" key={item._id}><div className="d-flex justify-content-between gap-3"><strong>{item.title}</strong><small className="text-muted">{new Date(item.createdAt).toLocaleString()}</small></div><p className="mb-1">{item.message}</p><small className="text-muted">Recipient role: {item.recipientRole}</small></article>) : <Empty>No messages sent yet.</Empty>}</section>}
        {section === 'settings' && <section className="premium-card"><h2 className="h5">Settings</h2><p className="mb-0 text-muted">Admin access is protected by the role-restricted session. Manage platform records from the sections in this menu.</p></section>}
      </>}
    <Modal show={!!scheduleMatch} onHide={() => setScheduleMatch(null)} centered size="lg"><form onSubmit={submitSchedule}><Modal.Header closeButton><Modal.Title>Schedule approved donation</Modal.Title></Modal.Header><Modal.Body><p className="text-muted small">These appointment details and the message will be sent to both the donor and patient.</p><div className="row g-3">{[['date', 'Date', 'date'], ['time', 'Time', 'time'], ['place', 'Place', 'text'], ['hospital', 'Hospital', 'text'], ['address', 'Address', 'text'], ['contactPerson', 'Contact person', 'text']].map(([key, label, type]) => <div className="col-12 col-md-6" key={key}><label className="form-label">{label}</label><input className="form-control" type={type} min={type === 'date' ? new Date().toISOString().slice(0, 10) : undefined} required value={scheduleForm[key]} onChange={(e) => setScheduleForm({ ...scheduleForm, [key]: e.target.value })} /></div>)}<div className="col-12"><label className="form-label">Instructions</label><textarea className="form-control" rows="2" required value={scheduleForm.instructions} onChange={(e) => setScheduleForm({ ...scheduleForm, instructions: e.target.value })} /></div><div className="col-12"><label className="form-label">Message template</label><textarea className="form-control" rows="3" required value={scheduleForm.messageTemplate} onChange={(e) => setScheduleForm({ ...scheduleForm, messageTemplate: e.target.value })} /><small className="form-text">Use {'{date}'}, {'{time}'}, {'{place}'}, {'{hospital}'}, {'{address}'}, {'{contactPerson}'}, and {'{instructions}'}.</small></div></div></Modal.Body><Modal.Footer><button type="button" className="btn btn-outline-secondary" onClick={() => setScheduleMatch(null)}>Cancel</button><button type="submit" className="btn btn-blood-primary">Schedule and send</button></Modal.Footer></form></Modal>
  </DashboardLayout>;
}
