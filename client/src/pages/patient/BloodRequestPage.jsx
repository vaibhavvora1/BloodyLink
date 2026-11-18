import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/forms/FormInput';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';
import UrgencySelector from '../../components/forms/UrgencySelector';

export default function BloodRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ bloodGroup: '', units: 1, hospital: '', city: user?.city || '', urgency: 'Urgent', requiredDate: '', contactPhone: user?.phone || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const validate = () => {
    const next = {};
    if (!formData.bloodGroup) next.bloodGroup = 'Choose the required blood group.';
    if (!formData.hospital.trim()) next.hospital = 'Hospital is required.';
    if (!formData.city.trim()) next.city = 'City is required.';
    if (!Number.isInteger(Number(formData.units)) || Number(formData.units) < 1 || Number(formData.units) > 10) next.units = 'Units must be between 1 and 10.';
    if (!formData.requiredDate || formData.requiredDate < today) next.requiredDate = 'Choose today or a future date.';
    if (!/^\+?[0-9 ()-]{7,20}$/.test(formData.contactPhone.trim())) next.contactPhone = 'Enter a valid contact phone.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate() || loading) return;
    try {
      setLoading(true);
      await api.createBloodRequest({ ...formData, units: Number(formData.units) });
      toast.success('Blood request created. It is now visible to donors.');
      navigate('/patient/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Could not create your request.'); }
    finally { setLoading(false); }
  };

  const change = (key, value) => { setFormData((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  return <div className="container app-container py-5">
    <section className="premium-card form-animate mx-auto p-4" style={{ maxWidth: 680 }}>
      <div className="text-center mb-4"><span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 mb-2">Patient request</span><h1 className="h3 fw-bold">Create a blood request</h1><p className="text-muted small mb-0">Your contact details remain private until an admin approves a match.</p></div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3"><div className="col-12 col-sm-6"><BloodGroupSelect label="Blood group" value={formData.bloodGroup} onChange={(e) => change('bloodGroup', e.target.value)} required />{errors.bloodGroup && <div className="text-danger small mt-1">{errors.bloodGroup}</div>}</div><div className="col-12 col-sm-6"><FormInput label="Units needed" name="units" type="number" min="1" max="10" value={formData.units} onChange={(e) => change('units', e.target.value)} error={errors.units} required /></div>
          <div className="col-12 col-md-7"><FormInput label="Hospital" name="hospital" placeholder="Hospital name" value={formData.hospital} onChange={(e) => change('hospital', e.target.value)} error={errors.hospital} required /></div><div className="col-12 col-md-5"><FormInput label="City" name="city" placeholder="City" value={formData.city} onChange={(e) => change('city', e.target.value)} error={errors.city} required /></div>
          <div className="col-12 col-md-6"><FormInput label="Required date" name="requiredDate" type="date" min={today} value={formData.requiredDate} onChange={(e) => change('requiredDate', e.target.value)} error={errors.requiredDate} required /></div><div className="col-12 col-md-6"><UrgencySelector value={formData.urgency} onChange={(value) => change('urgency', value)} /></div>
          <div className="col-12"><FormInput label="Contact phone" name="contactPhone" type="tel" placeholder="Phone number" value={formData.contactPhone} onChange={(e) => change('contactPhone', e.target.value)} error={errors.contactPhone} required /></div>
        </div>
        <button className="btn btn-blood-primary w-100 py-3 mt-4" type="submit" disabled={loading}>{loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating request…</> : 'Submit blood request'}</button>
      </form>
    </section>
  </div>;
}
