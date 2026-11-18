import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { role } = useAuth();
  if (role === 'admin') return null;
  return (
    <footer className="border-top py-5 mt-auto" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container app-container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 mb-2"><i className="bi bi-droplet-fill text-danger fs-4" /><span className="fw-bold fs-5 text-dark">Blood<span className="text-danger">link</span></span></div>
            <p className="text-muted small mb-0">A platform for blood requests, donor offers and admin approved donation scheduling.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-dark mb-3">Explore</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/availability" className="text-muted text-decoration-none">Blood Availability</Link></li>
              <li><Link to="/donors" className="text-muted text-decoration-none">Find Donors</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="fw-bold text-dark mb-3">Account</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Create account</Link></li>
              <li><Link to="/forgot-password" className="text-muted text-decoration-none">Forgot password</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-top pt-4 text-center"><p className="text-muted small mb-0">&copy; {new Date().getFullYear()} Bloodlink</p></div>
      </div>
    </footer>
  );
}
