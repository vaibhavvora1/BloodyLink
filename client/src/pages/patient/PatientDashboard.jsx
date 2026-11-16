import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';

export default function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRequests();
      setRequests(res.data);
    } catch {
      setError('Unable to fetch your blood requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    return <span className={`status-badge ${s}`}>{status}</span>;
  };

  return (
    <div className="container app-container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Patient Portal</h1>
          <p className="text-muted small mb-0">Track and manage emergency blood requirements</p>
        </div>
        <Link to="/patient/request" className="btn btn-blood-primary">
          <i className="bi bi-plus-lg me-1"></i> New Blood Request
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Total Requests</span>
            <span className="fs-4 fw-bold">{requests.length}</span>
          </div>
        </div>
        <div className="col-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Pending Match</span>
            <span className="fs-4 fw-bold text-warning">
              {requests.filter((r) => r.status === 'Pending').length}
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="premium-card p-3 text-center">
            <span className="text-muted small d-block">Fulfilled</span>
            <span className="fs-4 fw-bold text-success">
              {requests.filter((r) => r.status === 'Fulfilled').length}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <StockSkeleton count={3} type="table" />
      ) : error ? (
        <StockError message={error} onRetry={loadRequests} />
      ) : requests.length === 0 ? (
        <StockEmpty message="You have not submitted any blood requests yet." />
      ) : (
        <div className="row g-3">
          {requests.map((r) => (
            <div key={r.id} className="col-12 col-md-6">
              <div className="premium-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="blood-badge fs-6">{r.bloodGroup}</span>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="badge bg-danger-subtle text-danger">{r.urgency}</span>
                    {getStatusBadge(r.status)}
                  </div>
                </div>

                <h3 className="h5 fw-bold mb-1">{r.patientName}</h3>
                <p className="text-muted small mb-2">
                  <i className="bi bi-hospital me-1"></i> {r.hospital}, {r.city}
                </p>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top small text-muted">
                  <span>Units Required: <strong className="text-dark">{r.units}</strong></span>
                  <span>ID: <code className="text-muted">{r.id}</code></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
