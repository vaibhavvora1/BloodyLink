import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDonorProfile().catch(() => ({ data: user }));
      setProfile(res.data || user);
    } catch {
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleAvailability = async () => {
    try {
      setToggling(true);
      const nextStatus = !profile?.isAvailable;
      await api.updateDonorAvailability(nextStatus);
      setProfile((prev) => ({ ...prev, isAvailable: nextStatus }));
      toast.success(nextStatus ? 'You are marked available to donate!' : 'Availability paused.');
    } catch {
      toast.error('Could not update availability.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="container app-container py-5"><StockSkeleton /></div>;

  return (
    <div className="container app-container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill mb-2">Donor Portal</span>
          <h1 className="h3 fw-bold mb-1">Welcome back, {profile?.name || user?.name}</h1>
          <p className="text-muted small mb-0">Track your donations and availability to save lives in {profile?.city || user?.city || 'your area'}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm ${profile?.isAvailable ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={handleToggleAvailability}
            disabled={toggling}
          >
            <i className={`bi ${profile?.isAvailable ? 'bi-check-circle-fill' : 'bi-pause-circle'} me-1`}></i>
            {profile?.isAvailable ? 'Available to Donate' : 'Unavailable'}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Blood Group</span>
            <span className="fs-3 fw-bold text-danger">{profile?.bloodGroup || user?.bloodGroup || 'O+'}</span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Status</span>
            <span className={`fs-5 fw-bold ${profile?.isAvailable ? 'text-success' : 'text-muted'}`}>
              {profile?.isAvailable ? 'Ready for Donation' : 'Temporarily Inactive'}
            </span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Last Donation</span>
            <span className="fs-5 fw-bold text-dark">{profile?.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'No record'}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 text-danger">
                <i className="bi bi-calendar2-heart-fill fs-4"></i>
                <h2 className="h5 fw-bold mb-0">Schedule a Donation</h2>
              </div>
              <p className="text-muted small mb-3">Book an appointment at a blood bank or donation center near you.</p>
            </div>
            <Link to="/donor/schedule" className="btn btn-blood-primary btn-sm align-self-start">
              Book Appointment <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 text-warning">
                <i className="bi bi-bell-fill fs-4 text-warning"></i>
                <h2 className="h5 fw-bold mb-0">Emergency Requests</h2>
              </div>
              <p className="text-muted small mb-3">View urgent blood requests from verified hospitals and patients needing your group.</p>
            </div>
            <Link to="/donor/requests" className="btn btn-blood-secondary btn-sm align-self-start">
              View Urgent Requests <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
