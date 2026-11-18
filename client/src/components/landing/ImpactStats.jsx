import React from 'react';

export default function ImpactStats() {
  const steps = [
    { label: 'Patients create a request', icon: 'bi-clipboard2-pulse' },
    { label: 'Donors offer or accept', icon: 'bi-heart-pulse' },
    { label: 'Admin approves and schedules', icon: 'bi-calendar2-check' }
  ];

  return (
    <section className="py-5 border-top border-bottom bg-white">
      <div className="container app-container">
        <div className="row g-4 text-center">
          {steps.map((s) => (
            <div key={s.label} className="col-12 col-md-4">
              <div className="p-3">
                <i className={`bi ${s.icon} fs-2 text-danger mb-2 d-inline-block`} />
                <h3 className="h6 fw-bold mb-1 text-dark">{s.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
