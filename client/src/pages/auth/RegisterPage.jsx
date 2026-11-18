import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/forms/FormInput';
import PasswordInput from '../../components/forms/PasswordInput';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';

const initialForm = {
  name: '', email: '', password: '', role: 'donor', bloodGroup: '',
  city: '', phone: '', age: '', gender: '', hospital: ''
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Valid email is required.';
    if (!formData.bloodGroup) errs.bloodGroup = 'Blood group is required.';
    if (!formData.gender) errs.gender = 'Gender is required.';
    const pw = formData.password;
    if (!pw || pw.length < 8 || !/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw) || !/[^A-Za-z0-9]/.test(pw)) {
      errs.password = 'Min 8 chars with upper, lower, number, and symbol.';
    }
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.phone || !/^\+?[0-9 ()-]{7,20}$/.test(formData.phone)) errs.phone = 'Valid phone number required.';
    if (formData.role === 'donor') {
      const ageNum = Number(formData.age);
      if (!ageNum || ageNum < 18 || ageNum > 65) errs.age = 'Donors must be between 18 and 65.';
    } else {
      if (!formData.hospital.trim()) errs.hospital = 'Hospital name is required.';
      if (formData.age === '' || !Number.isInteger(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 120) errs.age = 'Age must be between 0 and 120.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    try {
      setLoading(true);
      const payload = { ...formData };
      if (formData.role === 'donor') delete payload.hospital;
      else { payload.age = Number(payload.age); }
      delete payload.role;

      await register(formData.role, payload);
      toast.success('Registration successful!');
      navigate(formData.role === 'patient' ? '/patient/dashboard' : '/donor/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container py-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-card mx-auto p-4" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold mb-1">Create an Account</h1>
          <p className="text-muted small">Join Bloodlink to save lives or request urgent blood</p>
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
                  <i className={`bi ${r === 'donor' ? 'bi-heart-fill' : 'bi-hospital-fill'} me-1`}></i>
                  {r === 'donor' ? 'Blood Donor' : 'Patient'}
                </button>
              ))}
            </div>
          </div>

          <FormInput label="Full Name" name="name" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} icon="bi-person-fill" required />
          <FormInput label="Email Address" name="email" type="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} icon="bi-envelope-fill" required />

          <div className="row g-2">
            <div className="col-6">
              <BloodGroupSelect label="Blood Group" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} error={errors.bloodGroup} required />
            </div>
            <div className="col-6">
              <FormInput label="City" name="city" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} error={errors.city} required />
            </div>
          </div>

          {formData.role === 'donor' ? (
            <div className="row g-2">
              <div className="col-6">
                <FormInput label="Age" name="age" type="number" min="18" max="65" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} error={errors.age} required />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-dark mb-1">Gender</label>
                <select className="form-select form-select-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
              </div>
            </div>
          ) : (
            <>
              <FormInput label="Age" name="age" type="number" min="0" max="120" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} error={errors.age} required />
              <label className="form-label small fw-semibold text-dark mb-1">Gender</label>
              <select className="form-select form-select-sm mb-3" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}><option value="">Select gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select>
              {errors.gender && <div className="text-danger small mb-2">{errors.gender}</div>}
              <FormInput label="Hospital" name="hospital" placeholder="Hospital name" value={formData.hospital} onChange={(e) => setFormData({ ...formData, hospital: e.target.value })} error={errors.hospital} required />
            </>
          )}

          <FormInput label="Phone Number" name="phone" type="tel" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={errors.phone} icon="bi-telephone-fill" required />
          <PasswordInput label="Create Password" name="password" placeholder="Create a secure password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} required />

          <button type="submit" className="btn btn-blood-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-3" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : null}
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>
        <div className="text-center mt-3 pt-2 border-top">
          <span className="small text-muted">Already registered? </span>
          <Link to="/login" className="small text-danger fw-bold text-decoration-none">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
