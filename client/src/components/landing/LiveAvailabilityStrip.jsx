import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BloodGroupCard from '../stock/BloodGroupCard';
import StockSkeleton from '../stock/StockSkeleton';

export default function LiveAvailabilityStrip() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPublicStockAvailability()
      .then((res) => { if (isMounted) setAvailability(res.data); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container app-container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <div>
            <span className="text-danger fw-semibold small text-uppercase tracking-wide">
              Live Regional Reserve
            </span>
            <h2 className="fw-bold mb-1">Blood Availability Strip</h2>
            <p className="text-muted small mb-0">Public real-time safety levels across all blood groups</p>
          </div>
          <Link to="/availability" className="btn btn-sm btn-outline-danger">
            View Detailed Inventory <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <StockSkeleton count={8} type="card" />
        ) : (
          <div className="row g-3">
            {availability.map((item) => (
              <div key={item.bloodGroup} className="col-6 col-md-3">
                <BloodGroupCard
                  bloodGroup={item.bloodGroup}
                  units={item.totalUnits}
                  status={item.status}
                  isPublic={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
