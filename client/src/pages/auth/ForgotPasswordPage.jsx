import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../services/api';
import FormInput from '../../components/forms/FormInput';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');

    try {
      setLoading(true);
      await api.forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link dispatched!');
    } catch {
      toast.error('Unable to send reset email. Please try again.');
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
        style={{ maxWidth: '420px' }}
      >
        <div className="text-center mb-4">
          <div className="fs-1 text-danger mb-2">
            <i className="bi bi-key-fill"></i>
          </div>
          <h1 className="h3 fw-bold mb-1">Forgot Password</h1>
          <p className="text-muted small">We'll send you instructions to reset your password</p>
        </div>

        {submitted ? (
          <div className="alert alert-success text-center py-3 mb-4">
            <i className="bi bi-check-circle-fill fs-3 d-block mb-2"></i>
            <h2 className="h6 fw-bold mb-1">Instructions Sent</h2>
            <p className="small text-muted mb-0">
              Check your inbox at <strong>{email}</strong> for your secure password reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Account Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              icon="bi-envelope-fill"
              required
            />

            <button
              type="submit"
              className="btn btn-blood-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : null}
              <span>{loading ? 'Sending Instructions...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/login" className="small text-danger fw-semibold text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
