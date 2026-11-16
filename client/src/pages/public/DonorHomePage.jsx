import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';

export default function DonorHomePage() {
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({ bloodGroup: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDonors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDonors(filters);
      setDonors(res.data);
    } catch {
      setError('Unable to fetch donors. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDonors(); }, [filters]);

  return (
    <div className="container app-container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-danger-subtle text-danger fw-semibold px-3 py-2 rounded-pill mb-2">
          Verified Donor Directory
        </span>
        <h1 className="display-6 fw-bold mb-2">Find Blood Donors</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Search active voluntary donors in your city. Contact numbers are masked for donor privacy until an emergency request is approved.
        </p>
      </div>

      <div className="premium-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <BloodGroupSelect
              label="Blood Group"
              includeAllOption
              allLabel="All Blood Groups"
              value={filters.bloodGroup}
              onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold text-dark mb-1">City Location</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter city (e.g. Mumbai, Kolkata)"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <StockSkeleton count={4} type="card" />
      ) : error ? (
        <StockError message={error} onRetry={loadDonors} />
      ) : donors.length === 0 ? (
        <StockEmpty
          message="No donors found matching your criteria in this city."
          onReset={() => setFilters({ bloodGroup: '', city: '' })}
        />
      ) : (
        <div className="row g-3">
          {donors.map((d) => (
            <div key={d.id} className="col-12 col-sm-6 col-lg-4">
              <div className="premium-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="blood-badge fs-6">{d.bloodGroup}</span>
                    <span className={`badge ${d.isAvailable ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'} rounded-pill`}>
                      {d.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <h3 className="h5 fw-bold mb-1 text-dark">{d.name}</h3>
                  <div className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i> {d.city}
                  </div>
                  <div className="bg-light p-2 rounded mb-3 small text-muted">
                    <div><i className="bi bi-telephone me-1"></i> {d.maskedPhone}</div>
                    <div><i className="bi bi-envelope me-1"></i> {d.maskedEmail}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-blood-primary w-100"
                  onClick={() => navigate(`/patient/request?group=${encodeURIComponent(d.bloodGroup)}`)}
                >
                  <i className="bi bi-send-fill me-1"></i> Request Blood
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
