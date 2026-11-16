import React from 'react';
import CountUp from '../reactbits/CountUp';

export default function ImpactStats() {
  const stats = [
    { label: 'Registered Donors', val: 1240, suffix: '+', icon: 'bi-people-fill' },
    { label: 'Lives Saved', val: 3820, suffix: '+', icon: 'bi-heart-fill' },
    { label: 'Requests Fulfilled', val: 980, suffix: '+', icon: 'bi-check-all' },
    { label: 'Partner Hospitals', val: 45, suffix: '', icon: 'bi-hospital-fill' }
  ];

  return (
    <section className="py-5 border-top border-bottom bg-white">
      <div className="container app-container">
        <div className="row g-4 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="p-3">
                <i className={`bi ${s.icon} fs-2 text-danger mb-2 d-inline-block`}></i>
                <h3 className="display-6 fw-bold mb-1 text-dark">
                  <CountUp to={s.val} suffix={s.suffix} />
                </h3>
                <small className="text-muted fw-semibold">{s.label}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
