import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/forms/FormInput';
import PasswordInput from '../../components/forms/PasswordInput';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid administrative email is required.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    try {
      setLoading(true);
      const res = await login('admin', formData);
      toast.success(`Admin access granted. Welcome, ${res.user.name}.`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid administrative credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container py-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="premium-card mx-auto p-4 border border-dark-subtle"
        style={{ maxWidth: '440px' }}
      >
        <div className="text-center mb-4">
          <div className="fs-1 text-dark mb-2">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h1 className="h4 fw-bold mb-1 text-dark">Administrative Portal</h1>
          <p className="text-muted small">Restricted access for system administrators only</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Admin Email"
            name="email"
            type="email"
            placeholder="admin@bloodlink.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            icon="bi-shield-shaded"
            required
          />

          <PasswordInput
            label="Secret Key / Password"
            name="password"
            placeholder="Enter administrative password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
          />

          <button
            type="submit"
            className="btn btn-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="bi bi-key-fill"></i>
                <span>Authorize & Enter</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center text-muted" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-info-circle me-1"></i>
          All access attempts are monitored and logged. Unauthorized access is strictly prohibited.
        </div>
      </motion.div>
    </div>
  );
}
