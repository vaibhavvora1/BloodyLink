import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import FormInput from '../../components/forms/FormInput';
import PasswordInput from '../../components/forms/PasswordInput';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'donor', bloodGroup: 'O+', city: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Valid email is required.';
    if (!formData.password || formData.password.length < 6) errs.password = 'Minimum 6 characters.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errs.phone = 'Valid 10-digit phone required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    try {
      setLoading(true);
      const res = await api.register(formData);
      loginUser(res.data);
      toast.success('Registration successful!');
      navigate(formData.role === 'patient' ? '/patient/dashboard' : '/donor/schedule', { replace: true });
    } catch {
      toast.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container py-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-card mx-auto p-4" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold mb-1">Create an Account</h1>
          <p className="text-muted small">Join Bloodlink as a donor or patient</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark mb-1">I am registering as</label>
            <div className="btn-group w-100" role="group">
              {['donor', 'patient'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`btn btn-sm ${formData.role === r ? 'btn-danger' : 'btn-outline-secondary'} text-capitalize`}
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  <i className={`bi ${r === 'donor' ? 'bi-heart-fill' : 'bi-person-fill'} me-1`}></i>
                  {r === 'donor' ? 'Blood Donor' : 'Patient'}
                </button>
              ))}
            </div>
          </div>

          <FormInput label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} icon="bi-person-fill" required />
          <FormInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} icon="bi-envelope-fill" required />

          <div className="row g-2">
            <div className="col-6">
              <BloodGroupSelect label="Blood Group" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} required />
            </div>
            <div className="col-6">
              <FormInput label="City" name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} error={errors.city} required />
            </div>
          </div>

          <FormInput label="Phone Number" name="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={errors.phone} icon="bi-telephone-fill" required />
          <PasswordInput label="Create Password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} required />

          <button type="submit" className="btn btn-blood-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-3" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : null}
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>
        <div className="text-center mt-4 pt-3 border-top">
          <span className="small text-muted">Already registered? </span>
          <Link to="/login" className="small text-danger fw-bold text-decoration-none">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
