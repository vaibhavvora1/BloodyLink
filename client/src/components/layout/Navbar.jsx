import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  if (user?.role === 'admin') return null;
  const close = () => setIsOpen(false);
  const signOut = async () => { await logout(); close(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-navbar py-3">
      <div className="container app-container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={close}>
          <i className="bi bi-droplet-fill text-danger fs-4" />
          <span className="fw-bold fs-4 text-dark">Blood<span className="text-danger">link</span></span>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" aria-expanded={isOpen}>
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} fs-3`} />
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-2">
            <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/" end onClick={close}>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/availability" onClick={close}>Blood Availability</NavLink></li>
            {!isAuthenticated && <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/donors" onClick={close}>Find Donors</NavLink></li>}
            {user?.role === 'donor' && <>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/donor/dashboard" onClick={close}>Dashboard & History</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/donor/requests" onClick={close}>Open Requests</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/donor/profile" onClick={close}>Profile</NavLink></li>
            </>}
            {user?.role === 'patient' && <>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/patient/dashboard" onClick={close}>Dashboard & Inbox</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/patient/request" onClick={close}>Request Blood</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-dark fw-medium" to="/patient/profile" onClick={close}>Profile</NavLink></li>
            </>}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? <>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill"><i className="bi bi-person-fill me-1 text-danger" />{user?.name}</span>
              <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={signOut}><i className="bi bi-box-arrow-right me-1" />Logout</button>
            </> : <>
              <Link to="/login" className="btn btn-blood-secondary btn-sm" onClick={close}>Login</Link>
              <Link to="/register" className="btn btn-blood-primary btn-sm" onClick={close}>Register</Link>
            </>}
          </div>
        </div>
      </div>
    </nav>
  );
}
