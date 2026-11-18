import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormInput from '../../components/forms/FormInput';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); const [error, setError] = useState(''); const [submitted, setSubmitted] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address.'); return; }
    setError(''); setSubmitted(true);
  };
  return <div className="container app-container py-5"><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-card mx-auto form-animate p-4" style={{ maxWidth: 440 }}>
    <div className="text-center mb-4"><i className="bi bi-key-fill text-danger display-5" /><h1 className="h3 fw-bold mt-2">Forgot password</h1><p className="text-muted small">Enter the email address on your account.</p></div>
    {submitted ? <div className="alert alert-success"><strong>Request received.</strong><p className="small mb-0 mt-2">Password reset email delivery is not configured yet. Connect an email provider to send reset links.</p></div> : <form onSubmit={submit} noValidate><FormInput label="Account email" name="email" type="email" placeholder="Email address" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} error={error} required /><button type="submit" className="btn btn-blood-primary w-100">Send reset link</button></form>}
    <div className="text-center mt-4 pt-3 border-top"><Link to="/login" className="small text-danger fw-semibold text-decoration-none"><i className="bi bi-arrow-left me-1" />Back to login</Link></div>
  </motion.section></div>;
}
