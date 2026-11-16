import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-top py-5 mt-auto" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container app-container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-droplet-fill text-danger fs-4"></i>
              <span className="fw-bold fs-5 text-dark">Blood<span className="text-danger">link</span></span>
            </div>
            <p className="text-muted small mb-0">
              Connecting donors with patients across India. Fast, secure, and emergency-ready.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/donors" className="text-muted text-decoration-none">Find Donors</Link></li>
              <li><Link to="/patient/request" className="text-muted text-decoration-none">Emergency Request</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-dark mb-3">Roles</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/donor/schedule" className="text-muted text-decoration-none">Donor Portal</Link></li>
              <li><Link to="/patient/dashboard" className="text-muted text-decoration-none">Patient Portal</Link></li>
              <li><Link to="/admin/dashboard" className="text-muted text-decoration-none">Admin Area</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-dark mb-3">Emergency Support</h6>
            <p className="text-muted small mb-2">
              Available 24/7 for urgent blood requirements.
            </p>
            <div className="d-flex align-items-center gap-2 text-danger fw-semibold">
              <i className="bi bi-telephone-fill"></i>
              <span>Toll Free: 1800-BLOOD-LINK</span>
            </div>
          </div>
        </div>

        <div className="border-top pt-4 text-center">
          <p className="text-muted small mb-0">
            &copy; {new Date().getFullYear()} Bloodlink Platform. Built for lives.
          </p>
        </div>
      </div>
    </footer>
  );
}
