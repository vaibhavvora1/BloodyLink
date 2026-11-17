import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-navbar py-3">
      <div className="container app-container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-droplet-fill text-danger fs-4"></i>
          <span className="fw-bold fs-4 text-dark">Blood<span className="text-danger">link</span></span>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={toggle} aria-label="Toggle navigation">
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} fs-3`}></i>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link text-dark fw-medium" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark fw-medium" to="/availability">Availability</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark fw-medium" to="/donors">Find Donors</NavLink>
            </li>

            {user?.role === 'donor' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/donor/dashboard">Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/donor/schedule">Schedule</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/donor/requests">Requests</NavLink>
                </li>
              </>
            )}

            {user?.role === 'patient' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/patient/dashboard">Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/patient/request">Request Blood</NavLink>
                </li>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/admin/dashboard">Admin Panel</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-medium" to="/admin/blood-stock">Blood Stock</NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  <i className="bi bi-person-fill me-1 text-danger"></i> {user.name} ({user.role})
                </span>
                <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-blood-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-blood-primary btn-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
