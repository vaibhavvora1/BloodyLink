import React from 'react';
import { useNavigate } from 'react-router-dom';
import MagnetButton from '../reactbits/MagnetButton';

export default function CtaBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-5">
      <div className="container app-container">
        <div
          className="rounded-4 p-5 text-center text-white position-relative overflow-hidden shadow-lg"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <div className="position-relative" style={{ zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
            <span className="badge bg-white text-danger fw-bold px-3 py-2 rounded-pill mb-3">
              Be a Hero Today
            </span>
            <h2 className="display-6 fw-bold mb-3 text-white">
              Ready to Save Someone's Life?
            </h2>
            <p className="text-white-50 mb-4">
              It takes less than 15 minutes to donate blood, but the impact lasts a lifetime for a patient in critical care.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <MagnetButton
                onClick={() => navigate('/register')}
                className="btn btn-light text-danger fw-bold px-4 py-2 rounded-pill"
              >
                Join as a Donor
              </MagnetButton>
              <button
                type="button"
                onClick={() => navigate('/patient/request')}
                className="btn btn-outline-light px-4 py-2 rounded-pill fw-semibold"
              >
                Create Emergency Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
