import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DonorHomePage() {
  const { user } = useAuth();
  return <div className="container app-container py-5"><section className="premium-card text-center mx-auto p-5" style={{ maxWidth: 680 }}><i className="bi bi-shield-lock-fill text-danger display-5" /><h1 className="h3 fw-bold mt-3">Find a donor</h1><p className="text-muted">Donor identities and contact details are private until a match is approved. Sign in as a patient to view available offers and send a request.</p>{user?.role === 'patient' ? <Link to="/patient/dashboard" className="btn btn-blood-primary">View available offers</Link> : <div className="d-flex justify-content-center gap-2"><Link to="/login" className="btn btn-blood-secondary">Login</Link><Link to="/register" className="btn btn-blood-primary">Create account</Link></div>}</section></div>;
}
