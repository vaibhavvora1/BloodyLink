import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';

export default function DonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [responded, setResponded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRequests();
      setRequests(res.data);
    } catch {
      setError('Unable to load nearby emergency requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleRespond = (id) => {
    setResponded((prev) => ({ ...prev, [id]: true }));
    toast.success('Thank you! Your availability has been shared with the hospital.');
  };

  return (
    <div className="container app-container py-5">
      <div className="mb-4">
        <span className="badge bg-danger-subtle text-danger fw-semibold px-3 py-2 rounded-pill mb-2">
          Urgent Matching Feed
        </span>
        <h1 className="h3 fw-bold mb-1">Emergency Requests Nearby</h1>
        <p className="text-muted small mb-0">Verified hospital requests in your area needing urgent donors</p>
      </div>

      {loading ? (
        <StockSkeleton count={3} type="table" />
      ) : error ? (
        <StockError message={error} onRetry={loadRequests} />
      ) : requests.length === 0 ? (
        <StockEmpty message="No active emergency blood requests matching your group at this moment." />
      ) : (
        <div className="row g-3">
          {requests.map((r) => (
            <div key={r.id} className="col-12 col-md-6">
              <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="blood-badge fs-6">{r.bloodGroup}</span>
                    <span className="badge bg-danger px-2 py-1">{r.urgency}</span>
                  </div>

                  <h3 className="h5 fw-bold mb-1 text-dark">{r.patientName}</h3>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-hospital me-1"></i> {r.hospital}, {r.city}
                  </p>
                  <p className="small text-muted mb-3">
                    Units Needed: <strong className="text-dark">{r.units} Unit(s)</strong>
                  </p>
                </div>

                <div className="pt-3 border-top">
                  {responded[r.id] ? (
                    <button type="button" className="btn btn-sm btn-success w-100" disabled>
                      <i className="bi bi-check-circle-fill me-1"></i> Response Sent to Hospital
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-blood-primary w-100"
                      onClick={() => handleRespond(r.id)}
                    >
                      <i className="bi bi-heart-fill me-1"></i> I Can Donate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
