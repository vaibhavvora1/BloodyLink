import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import FormInput from '../../components/forms/FormInput';
import PasswordInput from '../../components/forms/PasswordInput';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'donor' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs = {};
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    try {
      setLoading(true);
      const res = await api.login(formData);
      loginUser(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.data.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (res.data.role === 'patient') {
        navigate('/patient/dashboard', { replace: true });
      } else {
        navigate('/donor/schedule', { replace: true });
      }
    } catch {
      toast.error('Invalid credentials. Please try again.');
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
        className="premium-card mx-auto p-4"
        style={{ maxWidth: '440px' }}
      >
        <div className="text-center mb-4">
          <div className="fs-1 text-danger mb-2">
            <i className="bi bi-droplet-half"></i>
          </div>
          <h1 className="h3 fw-bold mb-1">Welcome Back</h1>
          <p className="text-muted small">Sign in to your Bloodlink portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark mb-1">Login As</label>
            <div className="btn-group w-100" role="group">
              {['donor', 'patient', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`btn btn-sm ${formData.role === r ? 'btn-danger' : 'btn-outline-secondary'} text-capitalize`}
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            icon="bi-envelope-fill"
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
          />

          <div className="d-flex justify-content-end mb-4">
            <Link to="/forgot-password" className="small text-danger fw-semibold text-decoration-none">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-blood-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : null}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <span className="small text-muted">Don't have an account? </span>
          <Link to="/register" className="small text-danger fw-bold text-decoration-none">
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
