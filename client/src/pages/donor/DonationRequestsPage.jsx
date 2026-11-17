import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import DonationConfirmModal from '../../components/donor/DonationConfirmModal';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';

export default function DonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [responded, setResponded] = useState({});
  const [confirmingId, setConfirmingId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDonorRequests().catch(() => api.getRequests());
      setRequests(res.data || []);
    } catch {
      setError('Unable to load nearby emergency requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleConfirm = async (reqItem) => {
    const id = reqItem._id || reqItem.id;
    try {
      setConfirmingId(id);
      const res = await api.confirmDonation(id);
      setResponded((prev) => ({ ...prev, [id]: true }));
      setModalData(res.data || {
        patientName: reqItem.patientName,
        bloodGroup: reqItem.bloodGroup,
        hospital: reqItem.hospital,
        city: reqItem.city,
        donationDate: new Date().toISOString()
      });
      toast.success('Donation confirmed! Thank you for stepping up.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not confirm donation. Please check your eligibility.');
    } finally {
      setConfirmingId(null);
    }
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
          {requests.map((r) => {
            const reqId = r._id || r.id;
            const isConfirmed = responded[reqId] || r.status === 'Confirmed';
            const isProcessing = confirmingId === reqId;

            return (
              <div key={reqId} className="col-12 col-md-6">
                <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="blood-badge fs-6">{r.bloodGroup}</span>
                      <span className="badge bg-danger px-2 py-1">{r.urgency || 'Urgent'}</span>
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
                    {isConfirmed ? (
                      <button type="button" className="btn btn-sm btn-success w-100" disabled>
                        <i className="bi bi-check-circle-fill me-1"></i> Donation Confirmed
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-blood-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleConfirm(r)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Confirming Donation...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-heart-fill"></i>
                            <span>I Can Donate</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DonationConfirmModal
        show={!!modalData}
        onHide={() => setModalData(null)}
        donationData={modalData}
      />
    </div>
  );
}
