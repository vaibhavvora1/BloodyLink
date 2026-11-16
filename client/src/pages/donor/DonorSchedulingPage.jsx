import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CENTERS = [
  'Red Cross Blood Bank, Central',
  'City General Hospital Transfusion Center',
  'Rotary Blood Care Camp, North Ward'
];

export default function DonorSchedulingPage() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [slotData, setSlotData] = useState({ center: CENTERS[0], date: '', time: 'Morning (09:00 - 12:00)' });
  const [scheduled, setScheduled] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    toast.info(`Availability set to: ${!isAvailable ? 'Available for emergency calls' : 'Temporarily paused'}`);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!slotData.date) {
      toast.error('Please pick a donation date.');
      return;
    }
    try {
      setLoading(true);
      await api.scheduleDonation(slotData);
      setScheduled(slotData);
      toast.success('Donation appointment confirmed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Donor Portal</h1>
          <p className="text-muted small mb-0">Schedule donations and toggle emergency availability</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-semibold">{isAvailable ? 'Emergency Ready' : 'Standby Mode'}</span>
          <button
            type="button"
            className={`btn btn-sm ${isAvailable ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={handleToggle}
          >
            <i className={`bi ${isAvailable ? 'bi-toggle-on' : 'bi-toggle-off'} fs-5 me-1 align-middle`}></i>
            {isAvailable ? 'Available' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="premium-card p-4">
            <h2 className="h5 fw-bold mb-3">Schedule Voluntary Donation</h2>
            <form onSubmit={handleSchedule}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Donation Center</label>
                <select
                  className="form-select"
                  value={slotData.center}
                  onChange={(e) => setSlotData({ ...slotData, center: e.target.value })}
                >
                  {CENTERS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Preferred Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={slotData.date}
                    onChange={(e) => setSlotData({ ...slotData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Time Window</label>
                  <select
                    className="form-select"
                    value={slotData.time}
                    onChange={(e) => setSlotData({ ...slotData, time: e.target.value })}
                  >
                    <option value="Morning (09:00 - 12:00)">Morning (9am - 12pm)</option>
                    <option value="Afternoon (13:00 - 16:00)">Afternoon (1pm - 4pm)</option>
                    <option value="Evening (17:00 - 20:00)">Evening (5pm - 8pm)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-blood-primary w-100 py-2" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="premium-card p-4 mb-4">
            <h2 className="h6 fw-bold mb-3 text-uppercase text-muted">Upcoming Appointment</h2>
            {scheduled ? (
              <div className="bg-light p-3 rounded">
                <div className="text-danger fw-bold mb-1"><i className="bi bi-calendar-check me-1"></i> {scheduled.date}</div>
                <div className="small text-dark fw-medium mb-1">{scheduled.center}</div>
                <div className="small text-muted">{scheduled.time}</div>
              </div>
            ) : (
              <p className="small text-muted mb-0">No upcoming donation scheduled yet.</p>
            )}
          </div>

          <div className="premium-card p-4">
            <h2 className="h6 fw-bold mb-3 text-uppercase text-muted">Recent Donation History</h2>
            <div className="border-bottom py-2 d-flex justify-content-between small">
              <span>Whole Blood (1 Unit)</span>
              <span className="text-muted">15 Aug 2026</span>
            </div>
            <div className="py-2 d-flex justify-content-between small">
              <span>Platelets (1 Unit)</span>
              <span className="text-muted">02 May 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
