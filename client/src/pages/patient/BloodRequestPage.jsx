import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import FormInput from '../../components/forms/FormInput';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';
import UrgencySelector from '../../components/forms/UrgencySelector';

export default function BloodRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    patientName: '', bloodGroup: searchParams.get('group') || 'A+', units: 1, hospital: '', city: '', urgency: 'Immediate', contactPhone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.patientName.trim()) errs.patientName = 'Patient name is required.';
    if (!formData.hospital.trim()) errs.hospital = 'Hospital name is required.';
    if (!formData.city.trim()) errs.city = 'City location is required.';
    if (!formData.units || Number(formData.units) < 1 || Number(formData.units) > 10) errs.units = 'Units must be 1-10.';
    if (!formData.contactPhone || !/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
      errs.contactPhone = 'Valid 10-digit phone required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    try {
      setLoading(true);
      await api.createBloodRequest(formData);
      toast.success('Emergency blood request dispatched!');
      navigate('/patient/dashboard');
    } catch {
      toast.error('Failed to register request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container py-5">
      <div className="premium-card mx-auto p-4" style={{ maxWidth: '620px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-danger text-white px-3 py-2 rounded-pill mb-2">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> Priority Emergency
          </span>
          <h1 className="h3 fw-bold mb-1">Create Blood Request</h1>
          <p className="text-muted small">Notify voluntary donors in your city immediately</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput label="Patient Full Name" name="patientName" placeholder="e.g. Rahul Sharma" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} error={errors.patientName} icon="bi-person-fill" required />

          <div className="row g-3">
            <div className="col-6">
              <BloodGroupSelect label="Blood Group Required" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} required />
            </div>
            <div className="col-6">
              <FormInput label="Units Needed" name="units" type="number" min="1" max="10" value={formData.units} onChange={(e) => setFormData({ ...formData, units: e.target.value })} error={errors.units} required />
            </div>
          </div>

          <UrgencySelector value={formData.urgency} onChange={(val) => setFormData({ ...formData, urgency: val })} />

          <div className="row g-3">
            <div className="col-12 col-md-7">
              <FormInput label="Hospital / Clinic Name" name="hospital" placeholder="e.g. City Care Hospital" value={formData.hospital} onChange={(e) => setFormData({ ...formData, hospital: e.target.value })} error={errors.hospital} icon="bi-hospital-fill" required />
            </div>
            <div className="col-12 col-md-5">
              <FormInput label="City" name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} error={errors.city} icon="bi-geo-alt-fill" required />
            </div>
          </div>

          <FormInput label="Attendant / Contact Phone" name="contactPhone" type="tel" placeholder="9876543210" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} error={errors.contactPhone} icon="bi-telephone-fill" required />

          <button type="submit" className="btn btn-blood-primary w-100 py-3 mt-3 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : null}
            <span>{loading ? 'Broadcasting Request...' : 'Submit Emergency Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
