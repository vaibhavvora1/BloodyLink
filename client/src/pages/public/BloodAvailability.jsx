import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BloodGroupCard from '../../components/stock/BloodGroupCard';
import BloodGroupSelect from '../../components/forms/BloodGroupSelect';
import StockSkeleton from '../../components/stock/StockSkeleton';
import StockEmpty from '../../components/stock/StockEmpty';
import StockError from '../../components/stock/StockError';

export default function BloodAvailability() {
  const [availability, setAvailability] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPublicStockAvailability();
      setAvailability(res.data);
    } catch {
      setError('Failed to fetch blood availability levels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const handleRequest = (group) => {
    navigate(`/patient/request?group=${encodeURIComponent(group)}`);
  };

  const filtered = selectedGroup
    ? availability.filter((item) => item.bloodGroup === selectedGroup)
    : availability;

  return (
    <div className="container app-container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-danger-subtle text-danger fw-semibold px-3 py-2 rounded-pill mb-2">
          Real-Time Blood Levels
        </span>
        <h1 className="display-6 fw-bold mb-2">Public Blood Availability</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Check real-time regional availability across all 8 blood groups. If your required blood group is critical or low, please submit an emergency request immediately.
        </p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <BloodGroupSelect
            label="Filter by Blood Group"
            includeAllOption
            allLabel="All Blood Groups"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <StockSkeleton count={8} type="card" />
      ) : error ? (
        <StockError message={error} onRetry={loadAvailability} />
      ) : filtered.length === 0 ? (
        <StockEmpty message="No matching blood group records found." onReset={() => setSelectedGroup('')} />
      ) : (
        <div className="row g-3">
          {filtered.map((item) => (
            <div key={item.bloodGroup} className="col-12 col-sm-6 col-lg-3">
              <BloodGroupCard
                bloodGroup={item.bloodGroup}
                units={item.totalUnits}
                status={item.status}
                isPublic={true}
                onRequest={handleRequest}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
